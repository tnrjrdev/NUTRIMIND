import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../../auth/utils/session';
import { menuShortcuts, userProfile } from '../../feature/home/data/home.mock';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function DashboardIcon({ icon, className = 'h-5 w-5' }: { icon: string; className?: string }) {
  switch (icon) {
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M6 5h12v14H6z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 5v14" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
        </svg>
      );
    case 'basket':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M6 9h12l-1.4 9H7.4L6 9z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 9l3-4 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M4 6h2l1.6 7.5h8.9l1.7-5.2H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="18.5" r="1.3" fill="currentColor" />
          <circle cx="17" cy="18.5" r="1.3" fill="currentColor" />
        </svg>
      );
    case 'bike':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 17h4l3-7h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cup':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M7 7h8v4.5A4.5 4.5 0 0 1 10.5 16 4.5 4.5 0 0 1 6 11.5V8a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15 8h1.5a2 2 0 0 1 0 4H15" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M8 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 12.5l1.5 1.5L9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 12h4l2-3 3 6 2-4h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'lamp':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 4a5 5 0 0 0-5 5c0 2.1 1 3.5 2.7 4.9L10 16h4l.3-2.1C16 12.5 17 11.1 17 9a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
  }
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = getStoredUser();
  const currentUserName = storedUser?.nome || userProfile.name;
  const currentUserEmail = storedUser?.email || 'usuario@nutrimind.com';

  const menuItems = useMemo(
    () => [
      { id: 'home', label: 'Inicio', icon: 'heart', path: '/home' },
      ...menuShortcuts.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        path: item.path ?? '/home',
      })),
    ],
    []
  );

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex w-full flex-col border-b border-emerald-500 bg-emerald-600 px-4 py-5 lg:max-w-[290px] lg:border-b-0 lg:border-r lg:px-5">
      <div className="rounded-2xl border border-emerald-500 bg-emerald-700/30 px-4 py-6 text-center">
        <p className="max-w-full overflow-hidden font-serif text-[clamp(1.65rem,2.5vw,2.2rem)] uppercase leading-none tracking-[0.01em] text-yellow-300">
          nutrimind
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-emerald-100">por Tina Hartmann</p>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500 bg-emerald-700/30 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-yellow-300">
            {getInitials(currentUserName) || 'NM'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{currentUserName}</p>
            <p className="truncate text-xs text-emerald-100">{currentUserEmail}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-yellow-300">{getGreeting()}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl border border-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 transition hover:bg-emerald-500 hover:text-white"
        >
          Sair
        </button>
      </div>

      <nav className="mt-6 grid gap-1.5 flex-1">
        <p className="mb-2 pl-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
          Menu Principal
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/home' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                isActive
                  ? 'bg-emerald-500 text-yellow-300 shadow-md shadow-emerald-700/20'
                  : 'text-emerald-50 hover:bg-emerald-500/50 hover:text-white'
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${isActive ? 'bg-yellow-400/20' : 'bg-transparent'}`}>
                <DashboardIcon icon={item.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        <div className="rounded-2xl border border-orange-400/30 bg-orange-500/20 px-4 py-4 text-orange-200">
          <p className="text-xs uppercase tracking-[0.2em] opacity-90">Mensagens</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-orange-300">22</p>
            <p className="text-xs opacity-90">Atualizações</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

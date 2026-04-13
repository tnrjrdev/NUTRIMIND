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
    <aside className="w-full border-b border-[#eee4c7] bg-[#f7f1de] px-4 py-5 lg:max-w-[290px] lg:border-b-0 lg:border-r lg:px-5">
      <div className="rounded-[24px] border border-[#e2d3a0] bg-white px-5 py-6">
        <p className="max-w-full overflow-hidden font-serif text-[clamp(1.65rem,2.5vw,2.2rem)] uppercase leading-none tracking-[0.01em] text-[#b08f13]">
          nutrimind
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#8f7d40]">por Tina Hartmann</p>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#e6d8a9] bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4e9bf] text-base font-semibold text-[#8b6c08]">
            {getInitials(currentUserName) || 'NM'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#272727]">{currentUserName}</p>
            <p className="truncate text-xs text-[#777164]">{currentUserEmail}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#a2810e]">{getGreeting()}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-full border border-[#d7c26e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#896908] transition hover:bg-[#fbf5dc]"
        >
          Sair
        </button>
      </div>

      <div className="mt-5 rounded-[24px] bg-[#b89a1c] px-4 py-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/75">Mensagens</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-3xl font-semibold">22</p>
          <p className="text-xs text-white/80">Atualizacoes do dia</p>
        </div>
      </div>

      <nav className="mt-5 grid gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/home' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-[16px] px-4 py-3 text-left transition ${
                isActive
                  ? 'border border-[#dcca8a] bg-white text-[#6f5608]'
                  : 'bg-[#b89a1c] text-white hover:bg-[#a88912]'
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${isActive ? 'bg-[#f7edc8]' : 'bg-white/12'}`}>
                <DashboardIcon icon={item.icon} />
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

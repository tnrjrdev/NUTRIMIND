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
    case 'book': // Receitas
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 6.5C10.5 5 8 5 5 5v13c3 0 5.5 0 7 1.5C13.5 18 16 18 19 18V5c-3 0-5.5 0-7 1.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 6.5v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'basket': // Produtos
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M21 8H3l1 13h16l1-13z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cart': // Fornecedores
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 21h18M5 21V7l8-4v18M13 3l6 4v14M9 9v2M9 13v2M15 13v2M15 9v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'bike': // iFood
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 15H3v-4l4-5h6l3 5h5v4h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 15H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 6v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cup': // Chás
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 8h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 3v2M13 3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'check': // Substituições
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M16 3h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 3l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 21H3v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 21l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'heart': // Bem-estar
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 0 0 0-7.8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'lamp': // Dicas
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M9 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3a7 7 0 0 0-3.5 13H15.5A7 7 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
      { id: 'home', label: 'Início', icon: 'heart', path: '/home' },
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
        <p className="pt-1 max-w-full overflow-hidden font-serif text-[clamp(1.65rem,2.5vw,2.2rem)] uppercase leading-tight tracking-[0.01em] text-yellow-300">
          nutrimind
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-emerald-100">por Tina Hartmann</p>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500 bg-emerald-700/30 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-yellow-300">
            {getInitials(currentUserName) || 'NM'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{currentUserName}</p>
            <p className="truncate text-[10px] text-emerald-200">{currentUserEmail}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/50 text-emerald-200 transition hover:bg-emerald-500 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M15 16.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5M21 12H9M17 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
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
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500 text-yellow-300 shadow-md shadow-emerald-700/20'
                  : 'text-emerald-50 hover:bg-emerald-500/50 hover:text-white'
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                isActive ? 'bg-yellow-400/20' : 'bg-transparent'
              }`}>
                <DashboardIcon icon={item.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-700/20 px-4 py-3 text-emerald-200">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">Sistema</p>
          <p className="mt-1 text-xs text-emerald-100 opacity-90">Todos os módulos estão disponíveis.</p>
        </div>
      </div>
    </aside>
  );
}

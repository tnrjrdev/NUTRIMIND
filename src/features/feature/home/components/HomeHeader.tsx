import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from "../types/home.types";
import { clearAuthSession } from '../../../auth/utils/session';

type HomeHeaderProps = {
  user: UserProfile;
};

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 16C4 9.372 9.372 4 16 4" stroke="#b59619" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 16.5C6.5 12.357 9.857 9 14 9" stroke="#3f7f3f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 10.5C18.5 12.5 18 14.5 16.5 16" stroke="#3f7f3f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HomeHeader({ user }: HomeHeaderProps) {
  const navigate = useNavigate();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <header className="rounded-[32px] bg-gradient-to-r from-[#faf5df] via-[#fffdf7] to-[#f7efdc] p-6 shadow-[0_20px_60px_rgba(37,57,92,0.08)] ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-[#f2e6c2]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9b7e22] shadow-sm">
            <LeafIcon />
            Bem vindo de volta
          </div>
          <div>
            <p className="text-sm font-medium text-[#5f5f5f]">{user.greeting}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f2937] sm:text-4xl">
              {user.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[22px] bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          {user.avatarUrl && !avatarFailed ? (
            <img
              className="h-16 w-16 rounded-full object-cover ring-2 ring-[#e8ddb6]"
              src={user.avatarUrl}
              alt={`Avatar de ${user.name}`}
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6edd1] text-lg font-semibold text-[#9b7e22] ring-2 ring-[#e8ddb6]">
              {initials || 'NM'}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800">Perfil</p>
            <p className="text-xs text-[#6b7280]">Acesse suas receitas e atalhos</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 inline-flex items-center rounded-full border border-[#d4c28a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d6d08] transition hover:bg-[#fbf3d8]"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

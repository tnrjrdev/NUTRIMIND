import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../../layout/components/AppFooter';
import { AppShell } from '../../layout/components/AppShell';

type PublicScaffoldProps = {
  title: string;
  eyebrow?: string;
  heroImage: string;
  children: ReactNode;
  backTo?: string | number;
};

export function PublicScaffold({
  title,
  eyebrow = 'Nutrimind',
  heroImage,
  children,
  backTo = -1,
}: PublicScaffoldProps) {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-8 text-white sm:px-10 shadow-lg shadow-emerald-500/20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-yellow-200 drop-shadow-sm">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl drop-shadow-sm">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                Continue sua navegação dentro do mesmo ambiente do sistema, com ações e conteúdos centralizados.
              </p>
            </div>
            <span className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md shadow-sm">
              Módulo ativo
            </span>
          </div>
        </header>

        <div className="mt-8 mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-emerald-900/5 border border-slate-200">
            <div className="relative h-56 overflow-hidden sm:h-64">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImage}')` }}
              />
              <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply backdrop-blur-[2px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-yellow-300 drop-shadow-md">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.22em] text-white drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)] sm:text-4xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
                    <span aria-hidden="true">+</span>
                  </span>
                  Conteúdo
                </div>
                <button
                  type="button"
                  aria-label="Voltar"
                  onClick={() => {
                    if (typeof backTo === 'number') {
                      navigate(backTo);
                      return;
                    }

                    navigate(backTo);
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200"
                >
                  <span className="text-xl">‹</span>
                </button>
              </div>
              {children}
            </div>
          </div>
          <div className="mt-8 pb-8">
            <AppFooter />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

type EmptyStateProps = {
  message: string;
};

export function PublicEmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center transition-all">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-400 shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
           <path d="M9 13h6M12 10v6M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-emerald-800">Nenhum registro encontrado</h3>
      <p className="mt-2 text-sm text-emerald-600/80">{message}</p>
    </div>
  );
}

type LoadingStateProps = {
  message?: string;
};

export function PublicLoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500"></div>
      <p className="text-sm font-medium text-emerald-600">{message}</p>
    </div>
  );
}

type InfoBlockProps = {
  title: string;
  children: ReactNode;
};

export function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

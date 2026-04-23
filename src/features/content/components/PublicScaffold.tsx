import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../../layout/components/AppFooter';
import { AppShell } from '../../layout/components/AppShell';

type PublicScaffoldProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  heroImage: string;
  children: ReactNode;
  backTo?: string | number;
};

export function PublicScaffold({
  title,
  eyebrow = 'Nutrimind',
  subtitle,
  heroImage,
  children,
  backTo = -1,
}: PublicScaffoldProps) {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex min-h-full flex-1 flex-col">
        {/* Page header */}
        <header className="relative overflow-hidden rounded-2xl bg-white border-t-4 border-t-emerald-500 px-6 py-6 sm:px-8 shadow-sm ring-1 ring-slate-200">
          <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">{subtitle}</p>
              )}
            </div>
            <span className="self-start rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 shadow-sm lg:self-auto">
              Módulo ativo
            </span>
          </div>
        </header>

        <div className="mt-8 mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-emerald-900/5 border border-slate-200">
            {/* Hero image */}
            <div className="relative h-56 overflow-hidden sm:h-64">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ backgroundImage: `url('${heroImage}')` }}
              />
              <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply backdrop-blur-[2px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-yellow-300 drop-shadow-md">
                  {eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.22em] text-white drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)] sm:text-4xl">
                  {title}
                </h2>
              </div>
            </div>

            {/* Content area */}
            <div className="border-t border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm text-base" aria-hidden="true">
                    ✦
                  </span>
                  <span className="uppercase tracking-[0.18em]">Conteúdo</span>
                </div>
                <button
                  type="button"
                  aria-label="Voltar para a página anterior"
                  onClick={() => typeof backTo === 'number' ? navigate(backTo) : navigate(backTo)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span className="text-xl leading-none">‹</span>
                  Voltar
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

// ─── Empty State ───────────────────────────────────────────────────────────────

type EmptyStateProps = {
  message: string;
  hint?: string;
};

export function PublicEmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm ring-1 ring-slate-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-700">Nenhum registro encontrado</h3>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">{message}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Loading State (skeleton) ──────────────────────────────────────────────────

type LoadingStateProps = {
  message?: string;
  count?: number;
};

export function PublicLoadingState({ count = 4 }: LoadingStateProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando conteúdo">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white px-5 py-4"
        >
          {/* Icon skeleton */}
          <div className="h-11 w-11 shrink-0 rounded-[16px] bg-slate-100 animate-pulse" />
          {/* Text skeletons */}
          <div className="flex-1 space-y-2">
            <div
              className="h-4 rounded-full bg-slate-100 animate-pulse"
              style={{ width: `${55 + (i % 3) * 14}%` }}
            />
            <div
              className="h-3 rounded-full bg-slate-100 animate-pulse"
              style={{ width: `${35 + (i % 4) * 10}%` }}
            />
          </div>
          {/* Button skeleton */}
          <div className="hidden h-8 w-20 shrink-0 rounded-full bg-slate-100 animate-pulse sm:block" />
        </div>
      ))}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

// ─── Info Block ────────────────────────────────────────────────────────────────

type InfoBlockProps = {
  title: string;
  children: ReactNode;
  accent?: boolean;
};

export function InfoBlock({ title, children, accent = false }: InfoBlockProps) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        accent ? 'border-l-[3px] border-l-emerald-400 border-slate-200' : 'border-slate-200'
      }`}
    >
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

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
        <header className="rounded-[28px] border border-[#eadfbf] bg-[linear-gradient(135deg,#c6ab34_0%,#b89615_100%)] px-5 py-6 text-white sm:px-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/75">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[0.02em] sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/84 sm:text-base">
                Continue sua navegacao dentro do mesmo ambiente do sistema, com acoes e conteudos centralizados.
              </p>
            </div>
            <span className="rounded-[20px] border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-sm">
              Modulo ativo
            </span>
          </div>
        </header>

        <div className="mt-6 mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="overflow-hidden rounded-[36px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
            <div className="relative h-56 overflow-hidden sm:h-64">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImage}')` }}
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.22em] text-white drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] sm:text-4xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="border-t border-[#e9e9eb] px-5 py-5 sm:px-6 sm:py-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#a77f14]">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6ead2] text-[#a77f14] shadow-sm">
                    <span aria-hidden="true">+</span>
                  </span>
                  Conteudo
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e7d8a8] bg-white text-[#5d4b2f] shadow-sm transition hover:bg-[#fbf6e2]"
                >
                  <span className="text-xl">‹</span>
                </button>
              </div>
              {children}
            </div>
          </div>
          <AppFooter />
        </div>
      </div>
    </AppShell>
  );
}

type EmptyStateProps = {
  message: string;
};

export function PublicEmptyState({ message }: EmptyStateProps) {
  return <p className="py-6 text-center text-[#8d6b18]">{message}</p>;
}

type LoadingStateProps = {
  message?: string;
};

export function PublicLoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return <p className="py-6 text-center text-[#8d6b18]">{message}</p>;
}

type InfoBlockProps = {
  title: string;
  children: ReactNode;
};

export function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../services/api';
import { menuShortcuts } from '../data/home.mock';
import { AppFooter } from '../../../layout/components/AppFooter';
import { AppShell } from '../../../layout/components/AppShell';

type DashboardStats = {
  receitas: number;
  produtos: number;
  fornecedores: number;
  dicas: number;
};

type Receita = {
  id: number;
  nome: string;
  descricao?: string;
  destaque?: boolean;
};

const defaultStats: DashboardStats = {
  receitas: 0,
  produtos: 0,
  fornecedores: 0,
  dicas: 0,
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function formatDateLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());
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

export function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recipes, setRecipes] = useState<Receita[]>([]);
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [receitas, produtos, fornecedores, dicas] = await Promise.all([
          api.get('/receitas'),
          api.get('/produtos'),
          api.get('/fornecedores'),
          api.get('/dicas'),
        ]);

        if (!isMounted) return;

        const receitasData = Array.isArray(receitas.data) ? receitas.data : [];

        setStats({
          receitas: receitasData.length,
          produtos: Array.isArray(produtos.data) ? produtos.data.length : 0,
          fornecedores: Array.isArray(fornecedores.data) ? fornecedores.data.length : 0,
          dicas: Array.isArray(dicas.data) ? dicas.data.length : 0,
        });
        setRecipes(receitasData);
      } catch {
        if (!isMounted) return;
        setStats(defaultStats);
        setRecipes([]);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { label: 'Receitas', value: stats.receitas, helper: 'Biblioteca nutricional', icon: 'book' },
    { label: 'Produtos', value: stats.produtos, helper: 'Sugestoes ativas', icon: 'basket' },
    { label: 'Fornecedores', value: stats.fornecedores, helper: 'Parceiros cadastrados', icon: 'cart' },
    { label: 'Dicas', value: stats.dicas, helper: 'Conteudos rapidos', icon: 'lamp' },
  ];

  const recentRecipes = recipes.slice(0, 4);
  const featuredRecipes = recipes.filter((recipe) => recipe.destaque);
  const recipesToShow = showAllFeatured ? featuredRecipes : recentRecipes;

  return (
    <AppShell>
          <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-8 text-white sm:px-10 shadow-lg shadow-emerald-500/20">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"></div>
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-yellow-200 drop-shadow-sm">{getGreeting()}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl drop-shadow-sm">Gestão de pacientes</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                  Acesse seus módulos principais, acompanhe os números do sistema e continue sua rotina com mais clareza.
                </p>
              </div>

              <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Hoje</p>
                <p className="mt-1 text-base font-medium capitalize text-white">{formatDateLabel()}</p>
              </div>
            </div>
          </header>

          <section className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Resumo rápido</h2>
                <p className="text-sm text-slate-500">Números principais para orientar sua navegação.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                {loadingStats ? 'Carregando' : 'Atualizado'}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <article key={card.label} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.label}</p>
                      <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-800">
                        {loadingStats ? '--' : card.value}
                      </p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-100">
                      <DashboardIcon icon={card.icon} className="h-6 w-6" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">{card.helper}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Acesso rápido</h2>
                  <p className="text-sm text-slate-500">Módulos mais usados reunidos em um só lugar.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {menuShortcuts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => item.path && navigate(item.path)}
                    className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-emerald-500 shadow-sm transition-colors group-hover:bg-emerald-50">
                      <DashboardIcon icon={item.icon} className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">Abrir módulo e continuar consulta.</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Receitas em destaque</h2>
                  <p className="text-sm text-slate-500">
                    {showAllFeatured
                      ? 'Todas as receitas marcadas como destaque.'
                      : 'Receitas mais recentes para retomada rápida.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllFeatured((current) => !current)}
                  className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  {showAllFeatured ? 'Ver recentes' : 'Ver todas'}
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {recipesToShow.length === 0 ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    {showAllFeatured
                      ? 'Nenhuma receita em destaque encontrada no momento.'
                      : 'Nenhuma receita recente encontrada no momento.'}
                  </div>
                ) : (
                  recipesToShow.map((recipe, index) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => navigate(`/receitas/${recipe.id}`)}
                      className="group flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-4 text-left transition-all hover:border-emerald-200 hover:bg-white hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold uppercase tracking-[0.03em] text-slate-800">
                          {recipe.nome}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {showAllFeatured
                            ? 'Receita marcada como destaque para acesso rápido.'
                            : 'Continue a navegação a partir das receitas mais recentes.'}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>
          <div className="mt-8 pb-4">
            <AppFooter />
          </div>
    </AppShell>
  );
}

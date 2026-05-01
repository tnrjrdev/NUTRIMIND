import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../services/api';
import { menuShortcuts } from '../data/home.constants';
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
    { label: 'Receitas', singular: 'receita', value: stats.receitas, helper: 'Biblioteca nutricional', icon: 'book', path: '/receitas' },
    { label: 'Produtos', singular: 'produto', value: stats.produtos, helper: 'Sugestões ativas', icon: 'basket', path: '/produtos' },
    { label: 'Fornecedores', singular: 'fornecedor', value: stats.fornecedores, helper: 'Parceiros cadastrados', icon: 'cart', path: '/fornecedores' },
    { label: 'Dicas', singular: 'dica', value: stats.dicas, helper: 'Conteúdos rápidos', icon: 'lamp', path: '/dicas' },
  ];

  const recentRecipes = recipes.slice(0, 4);
  const featuredRecipes = recipes.filter((recipe) => recipe.destaque);
  const recipesToShow = showAllFeatured ? featuredRecipes : recentRecipes;

  return (
    <AppShell>
      <header className="relative overflow-hidden rounded-2xl bg-white border-t-4 border-t-emerald-500 px-6 py-6 sm:px-8 shadow-sm ring-1 ring-slate-200">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{getGreeting()}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestão de pacientes</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Acesse seus módulos principais, acompanhe os números do sistema e continue sua rotina com mais clareza.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-3 shadow-sm lg:self-auto self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Hoje</p>
            <p className="mt-1 text-sm font-semibold capitalize text-emerald-900">{formatDateLabel()}</p>
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
          {statCards.map((card) => {
            const isEmpty = !loadingStats && card.value === 0;

            return (
              <article key={card.label} className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 ${isEmpty ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-emerald-300'}`}>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-medium ${isEmpty ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</p>
                      <p className={`mt-3 text-4xl font-semibold tracking-tight ${isEmpty ? 'text-slate-300' : 'text-slate-800'}`}>
                        {loadingStats ? '--' : card.value}
                      </p>
                    </div>
                    <span className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${isEmpty ? 'bg-slate-200/50 text-slate-400' : 'bg-orange-50 text-orange-500 group-hover:bg-orange-100'}`}>
                      <DashboardIcon icon={card.icon} className="h-6 w-6" />
                    </span>
                  </div>

                  {!isEmpty && !loadingStats && (
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-sm text-slate-400">{card.helper}</p>
                      {/* Mini decorative trend line */}
                      <svg width="48" height="16" viewBox="0 0 48 16" fill="none" className="text-emerald-400 opacity-60">
                        <path d="M0 12C4.5 12 6.5 4 12 4C17.5 4 20 14 26 14C32 14 36 2 48 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {isEmpty && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Nenhuma {card.singular} cadastrada ainda — comece agora.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(card.path)}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      + Adicionar primeira {card.singular}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
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

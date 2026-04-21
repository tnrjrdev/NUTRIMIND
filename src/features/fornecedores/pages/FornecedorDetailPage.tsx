import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Cupom = {
  id: number;
  codigo: string;
  descricao?: string;
  validade?: string;
};

type Fornecedor = {
  id: number;
  nome: string;
  descricaoCurta?: string;
  descricaoDetalhada?: string;
  endereco?: string;
  telefone?: string;
  whatsapp?: string;
  instagram?: string;
  site?: string;
  categoria?: { nome: string };
  cupons: Cupom[];
};

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m6.5 7 5.5 5 5.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 0 3V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5a1.5 1.5 0 0 0 0-3V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.4 5.2 3.4 8.5S14.1 18.2 12 20.5M12 3.5C9.9 5.8 8.6 8.7 8.6 12s1.3 6.2 3.4 8.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function FornecedorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/fornecedores/${id}`);
        setItem(response.data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const contatos = useMemo(() => {
    if (!item) return [];

    return [
      item.endereco ? { label: 'Endereco', value: item.endereco } : null,
      item.telefone ? { label: 'Telefone', value: item.telefone } : null,
      item.whatsapp ? { label: 'WhatsApp', value: item.whatsapp } : null,
      item.instagram ? { label: 'Instagram', value: item.instagram } : null,
      item.site ? { label: 'Site', value: item.site } : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;
  }, [item]);

  if (loading || !item) {
    return (
      <PublicScaffold
        title="Fornecedor"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80"
        backTo="/fornecedores"
      >
        <PublicLoadingState message="Carregando fornecedor..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold
      title={item.nome}
      eyebrow={item.categoria?.nome || 'Fornecedor'}
      heroImage="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80"
      backTo={-1}
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/50">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a790c]">Resumo do parceiro</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-800">{item.descricaoCurta || 'Fornecedor parceiro da base Nutrimind'}</h2>
            <p className="mt-3 text-sm leading-6 text-[#71695a]">
              {item.descricaoDetalhada || 'Sem descricao detalhada cadastrada para este fornecedor.'}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Categoria</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-800">{item.categoria?.nome || 'Sem categoria'}</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
              >
                Voltar
              </button>
            </div>

            <p className="mt-6 text-sm leading-6 text-[#786f60]">
              Consulte os dados de contato, links e cupons ativos deste parceiro em um unico lugar.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#f4e7bf] text-orange-500">
                <ContactIcon />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Contato</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">Informacoes principais</h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {contatos.length === 0 ? (
                <PublicEmptyState message="Nenhuma informacao de contato cadastrada." />
              ) : (
                contatos.map((contato) => (
                  <div
                    key={`${contato.label}-${contato.value}`}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7d11]">{contato.label}</p>
                    <p className="mt-2 text-sm text-[#5f574a]">{contato.value}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#f4e7bf] text-orange-500">
                <TicketIcon />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Cupons</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">Ofertas disponiveis</h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {item.cupons.length === 0 ? (
                <PublicEmptyState message="Nenhum cupom ativo cadastrado para este fornecedor." />
              ) : (
                item.cupons.map((cupom) => (
                  <div
                    key={cupom.id}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-slate-800">{cupom.codigo}</p>
                      {cupom.validade && (
                        <span className="rounded-full bg-[#f4e7bf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-500">
                          Ate {new Date(cupom.validade).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[#6b6355]">{cupom.descricao || 'Cupom ativo sem descricao complementar.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {(item.site || item.instagram) && (
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#f4e7bf] text-orange-500">
                <GlobeIcon />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Links</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">Canais digitais</h3>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {item.instagram && (
                <a
                  href={item.instagram.startsWith('http') ? item.instagram : `https://instagram.com/${item.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                >
                  Instagram
                </a>
              )}
              {item.site && (
                <a
                  href={item.site}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                >
                  Acessar site
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </PublicScaffold>
  );
}

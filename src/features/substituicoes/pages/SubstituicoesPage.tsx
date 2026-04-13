import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
};

const initialFormState = {
  nome: '',
  descricao: '',
  ativo: true,
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 9h6M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 9h.01M7 13h.01M7 17h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 20h4l9.5-9.5-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m12.8 7.2 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M5 7h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 7l.7 11h6.6L16 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SubstituicoesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/substituicoes/categorias');
      setCategories(res.data);
    } catch {
      setError('Nao foi possivel carregar as categorias de substituicao.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return categories;
    return categories.filter((category) => {
      const haystack = `${category.nome} ${category.descricao ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [categories, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Categoria) => {
    setEditId(category.id);
    setFormData({
      nome: category.nome,
      descricao: category.descricao || '',
      ativo: category.ativo ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.nome.trim()) {
      setError('Informe o titulo da categoria.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      ativo: formData.ativo,
      ordemExibicao: 0,
    };

    try {
      if (editId) {
        await api.put(`/substituicoes/categorias/${editId}`, payload);
      } else {
        await api.post('/substituicoes/categorias', payload);
      }
      await fetchCategories();
      closeModal();
    } catch {
      setError(editId ? 'Nao foi possivel atualizar a categoria.' : 'Nao foi possivel cadastrar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar esta categoria?')) return;

    try {
      await api.delete(`/substituicoes/categorias/${id}`);
      if (selectedId === id) {
        setSelectedId(null);
      }
      await fetchCategories();
    } catch {
      setError('Nao foi possivel inativar a categoria.');
    }
  };

  return (
    <PublicScaffold
      title="Lista de substituicao"
      eyebrow="Substituicoes"
      heroImage="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#eadfbe] bg-white p-5 shadow-[0_14px_36px_rgba(92,68,11,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#2d2d2d]">Categorias da lista</h2>
              <p className="mt-1 text-sm text-[#776f61]">Crie categorias, abra os itens e mantenha a lista de substituicao organizada.</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative w-full sm:min-w-[320px]">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a2810d]">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Digite aqui sua busca"
                  className="w-full rounded-full border border-[#ddcf9f] bg-[#fffdf8] py-3 pl-12 pr-4 text-sm text-[#2d2d2d] outline-none transition focus:border-[#caaa42] focus:ring-2 focus:ring-[#e8d48d]"
                />
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b89614] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(146,112,11,0.2)] transition hover:bg-[#a58409]"
              >
                <PlusIcon />
                Adicionar
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <PublicLoadingState message="Carregando categorias..." />
            ) : filteredCategories.length === 0 ? (
              <PublicEmptyState message="Nenhuma categoria encontrada para esta busca." />
            ) : (
              <div className="space-y-3">
                {filteredCategories.map((category, index) => {
                  const isSelected = selectedId === category.id;

                  return (
                    <article
                      key={category.id}
                      className="rounded-[24px] border border-[#eadfbe] bg-[linear-gradient(180deg,#fffdfa_0%,#faf4e4_100%)] p-5 shadow-[0_12px_28px_rgba(98,74,13,0.05)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <button
                          type="button"
                          onClick={() => navigate(`/substituicoes/categoria/${category.id}`)}
                          className="flex flex-1 items-start gap-4 text-left"
                        >
                          <span className="flex h-11 min-w-11 items-center justify-center rounded-[16px] bg-[#f3e6bb] text-sm font-semibold text-[#8e6c09]">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <span className="block">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-lg font-semibold text-[#2f2f2f]">{category.nome}</span>
                              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                                category.ativo === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {category.ativo === false ? 'Inativa' : 'Ativa'}
                              </span>
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-[#756e60]">
                              {category.descricao || 'Abra a categoria para visualizar os itens de substituicao.'}
                            </span>
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/substituicoes/categoria/${category.id}`)}
                            className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                          >
                            Lista
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            className="inline-flex items-center gap-2 rounded-full border border-[#d4c27b] bg-[#fbf6e4] px-4 py-2 text-sm font-semibold text-[#836509] transition hover:bg-[#f5ebc6]"
                          >
                            <PencilIcon />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedId(isSelected ? null : category.id)}
                            className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                          >
                            {isSelected ? 'Ocultar acoes' : 'Mais acoes'}
                          </button>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 grid gap-2 rounded-[20px] border border-[#eadfbe] bg-[#fff8e9] p-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/substituicoes/categoria/${category.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4c27b] bg-white px-4 py-3 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                          >
                            <ListIcon />
                            Abrir lista
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(category.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <TrashIcon />
                            Inativar
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(30,25,14,0.38)] px-4 py-6 backdrop-blur-[2px] sm:px-6 sm:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center">
            <div className="my-auto w-full rounded-[32px] border border-[#dcc77c] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] p-6 shadow-[0_28px_80px_rgba(53,40,10,0.18)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a4810d]">
                    {editId ? 'Atualizacao' : 'Novo cadastro'}
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-[#2b2b2b]">
                    {editId ? 'Atualizar categoria da lista' : 'Cadastrar categoria da lista'}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#dbc46e] p-3 text-[#896908] transition hover:bg-[#fbf3d7]"
                  aria-label="Fechar modal"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Titulo</label>
                  <input
                    required
                    value={formData.nome}
                    onChange={(event) => setFormData({ ...formData, nome: event.target.value })}
                    className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                    placeholder="Digite o titulo"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Descricao</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(event) => setFormData({ ...formData, descricao: event.target.value })}
                    rows={4}
                    className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                    placeholder="Digite a descricao"
                  />
                </div>

                <div className="rounded-[24px] border border-[#e7d9aa] bg-white/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Status</p>
                  <label className="mt-3 inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                      className={`relative h-7 w-14 rounded-full transition ${formData.ativo ? 'bg-[#b89614]' : 'bg-slate-300'}`}
                      aria-pressed={formData.ativo}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          formData.ativo ? 'left-8' : 'left-1'
                        }`}
                      />
                    </button>
                    <span>{formData.ativo ? 'Categoria ativa' : 'Categoria inativa'}</span>
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#eadfbe] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-[#d8c98f] px-5 py-3 text-sm font-semibold text-[#7a6e50] transition hover:bg-white"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={saving}
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b89614] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(145,112,11,0.18)] transition hover:bg-[#a88709] disabled:opacity-60"
                  >
                    <PlusIcon />
                    {saving ? 'Salvando...' : editId ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PublicScaffold>
  );
}

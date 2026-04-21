import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Categoria = {
  id: number;
  nome: string;
};

type Cha = {
  id: number;
  nome: string;
  formaUtilizacao?: string;
  posologia?: string;
  contraindicacoes?: string;
  observacoes?: string;
  usoAdulto?: boolean;
  usoInfantil?: boolean;
  ativo?: boolean;
};

const initialFormState = {
  nome: '',
  formaUtilizacao: '',
  posologia: '',
  contraindicacoes: '',
  observacoes: '',
  usoAdulto: false,
  usoInfantil: false,
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

function TeaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 8h11v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 9h1.5a2.5 2.5 0 0 1 0 5H15" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

export function ChaCategoryPage() {
  const navigate = useNavigate();
  const { categoriaId } = useParams();
  const [items, setItems] = useState<Cha[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const numericCategoryId = Number(categoriaId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get(`/chas?categoriaId=${categoriaId}`),
        api.get('/chas/categorias'),
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      setError('Nao foi possivel carregar os chas desta categoria.');
    } finally {
      setLoading(false);
    }
  }, [categoriaId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const currentCategory = useMemo(
    () => categories.find((category) => category.id === numericCategoryId),
    [categories, numericCategoryId]
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return items;
    return items.filter((item) => {
      const haystack = `${item.nome} ${item.formaUtilizacao ?? ''} ${item.posologia ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [items, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    try {
      const response = await api.get(`/chas/${id}`);
      const item = response.data as Cha;
      setEditId(item.id);
      setFormData({
        nome: item.nome || '',
        formaUtilizacao: item.formaUtilizacao || '',
        posologia: item.posologia || '',
        contraindicacoes: item.contraindicacoes || '',
        observacoes: item.observacoes || '',
        usoAdulto: item.usoAdulto ?? false,
        usoInfantil: item.usoInfantil ?? false,
        ativo: item.ativo ?? true,
      });
      setIsModalOpen(true);
      setError('');
    } catch {
      setError('Nao foi possivel carregar o cha para edicao.');
    }
  };

  const closeModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!numericCategoryId) {
      setError('Categoria invalida.');
      return;
    }

    if (!formData.nome.trim()) {
      setError('Informe o titulo do cha.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      categoriaId: numericCategoryId,
      ...formData,
      ordemExibicao: 0,
    };

    try {
      if (editId) {
        await api.put(`/chas/${editId}`, payload);
      } else {
        await api.post('/chas', payload);
      }
      await fetchData();
      closeModal();
    } catch {
      setError(editId ? 'Nao foi possivel atualizar o cha.' : 'Nao foi possivel cadastrar o cha.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar este cha?')) return;

    try {
      await api.delete(`/chas/${id}`);
      if (selectedId === id) {
        setSelectedId(null);
      }
      await fetchData();
    } catch {
      setError('Nao foi possivel inativar o cha.');
    }
  };

  return (
    <PublicScaffold
      title={currentCategory ? `Chas - ${currentCategory.nome}` : 'Chas da categoria'}
      eyebrow="Chas"
      heroImage="https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1400&q=80"
      backTo="/chas"
    >
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Chas da categoria</h2>
              <p className="mt-1 text-sm text-[#776f61]">Cadastre novos chas, abra o detalhe ou ajuste os itens desta categoria.</p>
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
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
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
              <PublicLoadingState message="Carregando chas..." />
            ) : filteredItems.length === 0 ? (
              <PublicEmptyState message="Nenhum cha encontrado nesta categoria." />
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item, index) => {
                  const isSelected = selectedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-md shadow-slate-200/50"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <button
                          type="button"
                          onClick={() => navigate(`/chas/${item.id}`)}
                          className="flex flex-1 items-start gap-4 text-left"
                        >
                          <span className="flex h-11 min-w-11 items-center justify-center rounded-[16px] bg-emerald-50 text-sm font-semibold text-orange-500">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <span className="block">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-lg font-semibold text-[#2f2f2f]">{item.nome}</span>
                              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                                item.ativo === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                {item.ativo === false ? 'Inativo' : 'Ativo'}
                              </span>
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-[#756e60]">
                              {item.formaUtilizacao || 'Abra o detalhe para visualizar a forma de uso.'}
                            </span>
                            {item.posologia && (
                              <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                                {item.posologia}
                              </span>
                            )}
                            <span className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#88734c]">
                              <span className="rounded-full bg-[#f7efdb] px-3 py-1">Uso adulto: {item.usoAdulto ? 'Sim' : 'Nao'}</span>
                              <span className="rounded-full bg-[#f7efdb] px-3 py-1">Uso infantil: {item.usoInfantil ? 'Sim' : 'Nao'}</span>
                            </span>
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/chas/${item.id}`)}
                            className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                          >
                            Detalhe
                          </button>
                          <button
                            type="button"
                            onClick={() => void openEditModal(item.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
                          >
                            <PencilIcon />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedId(isSelected ? null : item.id)}
                            className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                          >
                            {isSelected ? 'Ocultar acoes' : 'Mais acoes'}
                          </button>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 grid gap-2 rounded-[20px] border border-slate-200 bg-white p-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/chas/${item.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                          >
                            <TeaIcon />
                            Abrir detalhe
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item.id)}
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
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center">
            <div className="my-auto w-full rounded-[32px] border border-emerald-200 bg-slate-50 p-6 shadow-2xl shadow-emerald-900/5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                    {editId ? 'Atualizacao' : 'Novo cadastro'}
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-800">
                    {editId ? 'Atualizar cha da categoria' : 'Cadastrar cha da categoria'}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#dbc46e] p-3 text-[#896908] transition hover:bg-emerald-100"
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
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite o titulo"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Forma de utilizar</label>
                  <textarea
                    value={formData.formaUtilizacao}
                    onChange={(event) => setFormData({ ...formData, formaUtilizacao: event.target.value })}
                    rows={3}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite a forma de utilizar"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Posologia</label>
                  <input
                    value={formData.posologia}
                    onChange={(event) => setFormData({ ...formData, posologia: event.target.value })}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite a posologia"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Contraindicacoes</label>
                  <textarea
                    value={formData.contraindicacoes}
                    onChange={(event) => setFormData({ ...formData, contraindicacoes: event.target.value })}
                    rows={3}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite as contraindicacoes"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Observacoes</label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(event) => setFormData({ ...formData, observacoes: event.target.value })}
                    rows={3}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite as observacoes"
                  />
                </div>

                <div className="rounded-[24px] border border-[#e7d9aa] bg-white/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Status</p>
                  <div className="mt-3 flex flex-wrap gap-6">
                    <label className="inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, usoAdulto: !formData.usoAdulto })}
                        className={`relative h-7 w-14 rounded-full transition ${formData.usoAdulto ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        aria-pressed={formData.usoAdulto}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            formData.usoAdulto ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                      <span>Uso adulto: {formData.usoAdulto ? 'Sim' : 'Nao'}</span>
                    </label>

                    <label className="inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, usoInfantil: !formData.usoInfantil })}
                        className={`relative h-7 w-14 rounded-full transition ${formData.usoInfantil ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        aria-pressed={formData.usoInfantil}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            formData.usoInfantil ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                      <span>Uso infantil: {formData.usoInfantil ? 'Sim' : 'Nao'}</span>
                    </label>

                    <label className="inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                        className={`relative h-7 w-14 rounded-full transition ${formData.ativo ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        aria-pressed={formData.ativo}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            formData.ativo ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                      <span>{formData.ativo ? 'Cha ativo' : 'Cha inativo'}</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
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
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    <PlusIcon />
                    {saving ? 'Salvando...' : editId ? 'Atualizar cha' : 'Cadastrar cha'}
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../../services/api';

type Category = {
  id: number;
  nome: string;
  descricao?: string | null;
  ordemExibicao?: number;
  ativo?: boolean;
};

type AdminCategoryManagerProps = {
  title: string;
  endpoint: string;
};

const initialState = {
  nome: '',
  descricao: '',
  ordemExibicao: '0',
  ativo: true,
};

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h3l1.6 1.8c.3.3.7.5 1.1.5H17.5A2.5 2.5 0 0 1 20 9.8v6.7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <path
        d="M4 20h4l9.5-9.5-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
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

export function AdminCategoryManager({ title, endpoint }: AdminCategoryManagerProps) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setCategorias(response.data);
    } catch {
      setError('Nao foi possivel carregar as categorias.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void fetchCategorias();
  }, [fetchCategorias]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return categorias;
    }

    return categorias.filter((categoria) => {
      const haystack = `${categoria.nome} ${categoria.descricao ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [categorias, search]);

  const resetForm = () => {
    setEditId(null);
    setFormData(initialState);
    setError('');
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialState);
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: Category) => {
    setEditId(categoria.id);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
      ordemExibicao: String(categoria.ordemExibicao ?? 0),
      ativo: categoria.ativo ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      ordemExibicao: Number(formData.ordemExibicao || 0),
    };

    try {
      if (editId) {
        await api.put(`${endpoint}/${editId}`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      await fetchCategorias();
      resetForm();
    } catch {
      setError('Nao foi possivel salvar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar esta categoria?')) return;

    try {
      await api.delete(`${endpoint}/${id}`);
      if (editId === id) {
        resetForm();
      }
      await fetchCategorias();
    } catch {
      setError('Nao foi possivel inativar a categoria.');
    }
  };

  return (
    <section className="rounded-[30px] border border-[#e8dcc0] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f2e4_100%)] p-6 shadow-[0_18px_45px_rgba(70,54,15,0.06)]">
      <div className="flex flex-col gap-5 border-b border-[#ece2c8] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full bg-[#efe3b6] px-4 py-2 text-[#9a790c]">
            <FolderIcon />
            <span className="text-xs font-semibold uppercase tracking-[0.24em]">Categorias</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-[#2a2a2a]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#726b5c]">
            Organize as categorias com uma lista mais legivel, busca rapida e edicao em modal para nao poluir a tela.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[260px] flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a48411]">
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria por nome ou descricao"
              className="w-full rounded-full border border-[#dfd0a0] bg-white py-3 pl-12 pr-4 text-sm text-[#2d2d2d] outline-none transition focus:border-[#c9ab42] focus:ring-2 focus:ring-[#e8d48d]"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b89614] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(146,112,11,0.2)] transition hover:bg-[#a58409]"
          >
            <PlusIcon />
            Nova categoria
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-[24px] border border-[#eadfbe] bg-white px-5 py-8 text-center text-sm text-[#776f60]">
            Carregando categorias...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d9c583] bg-[#fffdf7] px-5 py-10 text-center">
            <p className="text-base font-semibold text-[#695617]">Nenhuma categoria encontrada.</p>
            <p className="mt-2 text-sm text-[#7d7667]">
              Ajuste a busca ou crie uma nova categoria para este modulo.
            </p>
          </div>
        ) : (
          filteredCategories.map((categoria) => (
            <article
              key={categoria.id}
              className="flex flex-col gap-4 rounded-[24px] border border-[#eadfbe] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(79,62,16,0.04)] transition hover:border-[#d8c270] hover:shadow-[0_16px_34px_rgba(79,62,16,0.07)] lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-10 w-10 place-items-center rounded-full bg-[#f3e6bb] text-sm font-semibold text-[#8a6a08]">
                  {String(categoria.ordemExibicao ?? 0).padStart(2, '0')}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-[#2d2d2d]">{categoria.nome}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        categoria.ativo === false
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {categoria.ativo === false ? 'Inativa' : 'Ativa'}
                    </span>
                  </div>

                  {categoria.descricao ? (
                    <p className="mt-1 text-sm leading-6 text-[#726b5c]">{categoria.descricao}</p>
                  ) : (
                    <p className="mt-1 text-sm italic text-[#9a9384]">Sem descricao cadastrada.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(categoria)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4c27b] bg-[#fbf6e4] px-4 py-2 text-sm font-semibold text-[#836509] transition hover:bg-[#f5ebc6]"
                >
                  <PencilIcon />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(categoria.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <TrashIcon />
                  Inativar
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(30,25,14,0.38)] px-4 py-8 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-[32px] border border-[#dcc77c] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] p-6 shadow-[0_28px_80px_rgba(53,40,10,0.18)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a4810d]">
                  {editId ? 'Atualizacao' : 'Novo cadastro'}
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-[#2b2b2b]">
                  {editId ? 'Editar categoria' : 'Criar categoria'}
                </h4>
                <p className="mt-2 text-sm text-[#736c5d]">
                  Preencha os dados essenciais e mantenha a estrutura do modulo organizada.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-[#dbc46e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#896908] transition hover:bg-[#fbf3d7]"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                  Nome da categoria
                </label>
                <input
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                  placeholder="Ex: Refeicoes leves"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                  Descricao
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                  className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                  placeholder="Descreva rapidamente o uso dessa categoria."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ordemExibicao}
                    onChange={(e) => setFormData({ ...formData, ordemExibicao: e.target.value })}
                    className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                  />
                </div>

                <div className="rounded-[24px] border border-[#e7d9aa] bg-white/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Status</p>
                  <label className="mt-3 inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                      className={`relative h-7 w-14 rounded-full transition ${
                        formData.ativo ? 'bg-[#b89614]' : 'bg-slate-300'
                      }`}
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
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#eadfbe] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#d8c98f] px-5 py-3 text-sm font-semibold text-[#7a6e50] transition hover:bg-white"
                >
                  Cancelar
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-full bg-[#b89614] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(145,112,11,0.18)] transition hover:bg-[#a88709] disabled:opacity-60"
                >
                  {saving ? 'Salvando...' : editId ? 'Atualizar categoria' : 'Criar categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

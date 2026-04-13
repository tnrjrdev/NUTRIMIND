import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
  ordemExibicao?: number;
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3l1.8 4.7L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H12l8 8-6 6-8-8V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8.5" cy="9.5" r="1.2" fill="currentColor" />
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

export function FornecedoresPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/fornecedores/categorias');
      setCategories(response.data);
    } catch {
      setError('Nao foi possivel carregar as categorias de fornecedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

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

  const closeModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(false);
  };

  const handleEdit = (category: Categoria) => {
    setEditId(category.id);
    setFormData({
      nome: category.nome,
      descricao: category.descricao || '',
      ativo: category.ativo ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar esta categoria?')) return;

    try {
      await api.delete(`/fornecedores/categorias/${id}`);
      await fetchCategories();
    } catch {
      setError('Nao foi possivel inativar a categoria.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      ordemExibicao: 0,
    };

    try {
      if (editId) {
        await api.put(`/fornecedores/categorias/${editId}`, payload);
      } else {
        await api.post('/fornecedores/categorias', payload);
      }

      await fetchCategories();
      closeModal();
    } catch {
      setError('Nao foi possivel salvar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PublicScaffold
      title="Fornecedores"
      eyebrow="Parceiros"
      heroImage="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-[#eadfbe] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] p-5 shadow-[0_14px_36px_rgba(92,68,11,0.06)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e5bc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a790c]">
              <SparkIcon />
              Rede organizada
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[#2d2d2d]">Acompanhe e organize os fornecedores por categoria</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71695a]">
              Mantenha a rede de parceiros bem estruturada, com acesso rapido as categorias e aos fornecedores cadastrados.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#eadfbe] bg-white p-5 shadow-[0_14px_36px_rgba(92,68,11,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Resumo</p>
                <h3 className="mt-2 text-lg font-semibold text-[#2d2d2d]">Categorias disponiveis</h3>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#f4e7bf] text-[#8e6c09]">
                <TagIcon />
              </span>
            </div>

            <p className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2430]">
              {loading ? '--' : filteredCategories.length}
            </p>
            <p className="mt-2 text-sm text-[#786f60]">
              {search ? 'Resultados filtrados pela sua busca.' : 'Categorias prontas para consulta e manutencao.'}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadfbe] bg-white p-5 shadow-[0_14px_36px_rgba(92,68,11,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#2d2d2d]">Categorias de fornecedores</h2>
              <p className="mt-1 text-sm text-[#776f61]">Abra a categoria, cadastre novas opcoes ou ajuste as categorias ja existentes.</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative w-full sm:min-w-[320px]">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a2810d]">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome ou descricao"
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
              <PublicEmptyState message="Nenhuma categoria de fornecedor encontrada para esta busca." />
            ) : (
              <div className="space-y-3">
                {filteredCategories.map((category, index) => (
                  <article
                    key={category.id}
                    className="rounded-[24px] border border-[#eadfbe] bg-[linear-gradient(180deg,#fffdfa_0%,#faf4e4_100%)] p-5 shadow-[0_12px_28px_rgba(98,74,13,0.05)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <button
                        type="button"
                        onClick={() => navigate(`/fornecedores/categoria/${category.id}`)}
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
                            {category.descricao || 'Abra esta categoria para visualizar os fornecedores vinculados.'}
                          </span>
                        </span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <button
                          type="button"
                          onClick={() => navigate(`/fornecedores/categoria/${category.id}`)}
                          className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                        >
                          Abrir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#d4c27b] bg-[#fbf6e4] px-4 py-2 text-sm font-semibold text-[#836509] transition hover:bg-[#f5ebc6]"
                        >
                          <PencilIcon />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <TrashIcon />
                          Inativar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(30,25,14,0.38)] px-4 py-6 backdrop-blur-[2px] sm:px-6 sm:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center">
            <div className="my-auto w-full max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-[#dcc77c] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] shadow-[0_28px_80px_rgba(53,40,10,0.18)] sm:max-h-[calc(100vh-4rem)]">
              <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-4rem)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a4810d]">
                      {editId ? 'Atualizacao' : 'Novo cadastro'}
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-[#2b2b2b]">
                      {editId ? 'Atualizar categoria de fornecedores' : 'Cadastrar categoria de fornecedores'}
                    </h4>
                    <p className="mt-2 text-sm text-[#736c5d]">
                      Defina o nome da categoria e uma descricao curta para facilitar a organizacao dos parceiros.
                    </p>
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
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                      Titulo
                    </label>
                    <input
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                      placeholder="Digite o nome da categoria"
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
                      placeholder="Descreva rapidamente a categoria"
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
                      {saving ? 'Salvando...' : editId ? 'Atualizar categoria' : 'Cadastrar categoria'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicScaffold>
  );
}

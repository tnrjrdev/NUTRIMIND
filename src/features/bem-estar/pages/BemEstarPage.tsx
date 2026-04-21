import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Item = {
  id: number;
  nome: string;
  descricaoCurta?: string;
  telefone?: string;
  whatsapp?: boolean;
  instagram?: string;
  ativo?: boolean;
};

const initialFormState = {
  nome: '',
  descricaoCurta: '',
  telefone: '',
  whatsapp: false,
  instagram: '',
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

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M12 20s-6.5-4.3-8.5-8.3A5.2 5.2 0 0 1 8.3 4c1.6 0 2.9.7 3.7 1.9A4.6 4.6 0 0 1 15.7 4a5.2 5.2 0 0 1 4.8 7.7C18.5 15.7 12 20 12 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 11.5h2l1.2-2.2 1.6 4.2 1.1-2H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function BemEstarPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/bem-estar');
      setItems(res.data);
    } catch {
      setError('Nao foi possivel carregar os itens de bem-estar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return items;
    return items.filter((item) => {
      const haystack = `${item.nome} ${item.descricaoCurta ?? ''} ${item.telefone ?? ''} ${item.instagram ?? ''}`.toLowerCase();
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
      const response = await api.get(`/bem-estar/${id}`);
      const item = response.data as Item;
      setEditId(item.id);
      setFormData({
        nome: item.nome || '',
        descricaoCurta: item.descricaoCurta || '',
        telefone: item.telefone || '',
        whatsapp: item.whatsapp ?? false,
        instagram: item.instagram || '',
        ativo: item.ativo ?? true,
      });
      setIsModalOpen(true);
      setError('');
    } catch {
      setError('Nao foi possivel carregar o item para edicao.');
    }
  };

  const closeModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.nome.trim()) {
      setError('Informe o nome do item.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      ordemExibicao: 0,
      descricaoDetalhada: '',
      site: '',
      midiaUrl: '',
    };

    try {
      if (editId) {
        await api.put(`/bem-estar/${editId}`, payload);
      } else {
        await api.post('/bem-estar', payload);
      }
      await fetchItems();
      closeModal();
    } catch {
      setError(editId ? 'Nao foi possivel atualizar o item.' : 'Nao foi possivel cadastrar o item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar este item?')) return;

    try {
      await api.delete(`/bem-estar/${id}`);
      if (selectedId === id) {
        setSelectedId(null);
      }
      await fetchItems();
    } catch {
      setError('Nao foi possivel inativar o item.');
    }
  };

  return (
    <PublicScaffold
      title="Bem-estar"
      eyebrow="Indicacoes"
      heroImage="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Itens de bem-estar</h2>
              <p className="mt-1 text-sm text-[#776f61]">Cadastre novos parceiros e experiencias de bem-estar sem sair desta tela.</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative w-full sm:min-w-[320px]">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a2810d]">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar"
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
              <PublicLoadingState message="Carregando indicacoes..." />
            ) : filteredItems.length === 0 ? (
              <PublicEmptyState message="Nenhuma indicacao encontrada." />
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
                          onClick={() => navigate(`/bem-estar/${item.id}`)}
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
                              {item.descricaoCurta || 'Abra o detalhe para visualizar a experiencia completa.'}
                            </span>
                            <span className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#88734c]">
                              {item.telefone && <span className="rounded-full bg-[#f7efdb] px-3 py-1">Telefone: {item.telefone}</span>}
                              <span className="rounded-full bg-[#f7efdb] px-3 py-1">WhatsApp: {item.whatsapp ? 'Sim' : 'Nao'}</span>
                              {item.instagram && <span className="rounded-full bg-[#f7efdb] px-3 py-1">Instagram: {item.instagram}</span>}
                            </span>
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/bem-estar/${item.id}`)}
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
                            onClick={() => navigate(`/bem-estar/${item.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                          >
                            <HeartIcon />
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
                    {editId ? 'Atualizar item de bem-estar' : 'Cadastrar item de bem-estar'}
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Estabelecimento</label>
                  <input
                    required
                    value={formData.nome}
                    onChange={(event) => setFormData({ ...formData, nome: event.target.value })}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite o estabelecimento"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Descricao</label>
                  <textarea
                    value={formData.descricaoCurta}
                    onChange={(event) => setFormData({ ...formData, descricaoCurta: event.target.value })}
                    rows={3}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite a descricao"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Telefone</label>
                  <input
                    value={formData.telefone}
                    onChange={(event) => setFormData({ ...formData, telefone: event.target.value })}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Digite o telefone"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">WhatsApp</label>
                    <label className="inline-flex h-[52px] w-full items-center gap-3 rounded-[20px] border border-[#e7d9aa] bg-white px-4 py-3 text-sm font-medium text-[#4f493e]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, whatsapp: !formData.whatsapp })}
                        className={`relative h-7 w-14 rounded-full transition ${formData.whatsapp ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        aria-pressed={formData.whatsapp}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            formData.whatsapp ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                      <span>{formData.whatsapp ? 'Sim' : 'Nao'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Instagram</label>
                    <input
                      value={formData.instagram}
                      onChange={(event) => setFormData({ ...formData, instagram: event.target.value })}
                      className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="@perfil"
                    />
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e7d9aa] bg-white/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Status</p>
                  <label className="mt-3 inline-flex items-center gap-3 text-sm font-medium text-[#4f493e]">
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
                    <span>{formData.ativo ? 'Item ativo' : 'Item inativo'}</span>
                  </label>
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
                    {saving ? 'Salvando...' : editId ? 'Atualizar item' : 'Cadastrar item'}
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

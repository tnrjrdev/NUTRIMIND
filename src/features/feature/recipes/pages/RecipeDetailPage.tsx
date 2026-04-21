import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../../content/components/PublicScaffold';

type Receita = {
  id: number;
  categoriaId: number;
  nome: string;
  descricao?: string;
  tempoPreparo?: string;
  imagem?: string;
  ingredientes: Array<{ id: number; descricao: string }>;
  modosPreparo: Array<{ id: number; numeroPasso: number; descricao: string }>;
};

type ActiveTab = 'ingredientes' | 'modo-preparo';

type SelectedListItem = {
  id: number;
  tab: ActiveTab;
};

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3l1.8 4.7L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M6 5h12v14H6z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
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

export function RecipeDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Receita | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ingredientes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [formOrder, setFormOrder] = useState('');
  const [error, setError] = useState('');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedListItem | null>(null);

  useEffect(() => {
    api
      .get(`/receitas/${id}`)
      .then((res) => {
        setItem(res.data);
        setError('');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const tabItems = useMemo(() => {
    if (!item) return [];

    if (activeTab === 'ingredientes') {
      return item.ingredientes.map((ingrediente, index) => ({
        id: ingrediente.id,
        title: `${index + 1}. ${ingrediente.descricao}`,
        subtitle: item.tempoPreparo ? `Tempo de preparo: ${item.tempoPreparo}` : '',
      }));
    }

    return item.modosPreparo.map((modo) => ({
      id: modo.id,
      title: modo.descricao,
      subtitle: `Ordem: ${modo.numeroPasso}`,
    }));
  }, [activeTab, item]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormValue('');
    setFormOrder('');
    setEditItemId(null);
  };

  const openCreateModal = () => {
    setEditItemId(null);
    setFormValue('');
    setFormOrder('');
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!item || !selectedItem) return;

    if (selectedItem.tab === 'ingredientes') {
      const ingrediente = item.ingredientes.find((entry) => entry.id === selectedItem.id);
      if (!ingrediente) return;
      setFormValue(ingrediente.descricao);
      setFormOrder('');
    } else {
      const modo = item.modosPreparo.find((entry) => entry.id === selectedItem.id);
      if (!modo) return;
      setFormValue(modo.descricao);
      setFormOrder(String(modo.numeroPasso));
    }

    setEditItemId(selectedItem.id);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !formValue.trim()) {
      return;
    }

    setSaving(true);
    setError('');

    const parsedOrder = Number(formOrder);
    const normalizedOrder =
      activeTab === 'modo-preparo' && Number.isFinite(parsedOrder) && parsedOrder > 0
        ? Math.floor(parsedOrder)
        : item.modosPreparo.length + 1;

    const editableIngredientes: Array<{ id?: number; descricao: string }> = item.ingredientes.map((ingrediente) => ({
      id: ingrediente.id,
      descricao: ingrediente.descricao,
    }));

    const editableModos: Array<{ id?: number; descricao: string; numeroPasso: number }> = item.modosPreparo.map((modo) => ({
      id: modo.id,
      descricao: modo.descricao,
      numeroPasso: modo.numeroPasso,
    }));

    const nextIngredientes =
      activeTab === 'ingredientes'
        ? editableIngredientes
            .map((ingrediente) =>
              editItemId && ingrediente.id === editItemId
                ? { ...ingrediente, descricao: formValue.trim() }
                : ingrediente
            )
            .concat(editItemId ? [] : [{ descricao: formValue.trim() }])
            .map((ingrediente, index) => ({
              descricao: ingrediente.descricao,
              ordemExibicao: index,
            }))
        : item.ingredientes.map((ingrediente, index) => ({
            descricao: ingrediente.descricao,
            ordemExibicao: index,
          }));

    const nextModosPreparo =
      activeTab === 'modo-preparo'
        ? editableModos
            .map((modo) =>
              editItemId && modo.id === editItemId
                ? { ...modo, descricao: formValue.trim(), numeroPasso: normalizedOrder }
                : modo
            )
            .concat(editItemId ? [] : [{ descricao: formValue.trim(), numeroPasso: normalizedOrder }])
            .sort((a, b) => a.numeroPasso - b.numeroPasso)
            .map((modo, index) => ({
              descricao: modo.descricao,
              numeroPasso: index + 1,
            }))
        : item.modosPreparo.map((modo) => ({
            descricao: modo.descricao,
            numeroPasso: modo.numeroPasso,
          }));

    try {
      const response = await api.put(`/receitas/${item.id}`, {
        nome: item.nome,
        descricao: item.descricao || '',
        imagem: item.imagem || '',
        tempoPreparo: item.tempoPreparo || '',
        ativo: true,
        categoriaId: item.categoriaId,
        ingredientes: nextIngredientes,
        modosPreparo: nextModosPreparo,
      });

      setItem(response.data);
      setSelectedItem(null);
      closeModal();
    } catch {
      setError(
        activeTab === 'ingredientes'
          ? editItemId
            ? 'Nao foi possivel atualizar o ingrediente.'
            : 'Nao foi possivel cadastrar o ingrediente.'
          : editItemId
            ? 'Nao foi possivel atualizar o modo de preparo.'
            : 'Nao foi possivel cadastrar o modo de preparo.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!item || !selectedItem) return;
    if (!confirm('Deseja deletar este item?')) return;

    setSaving(true);
    setError('');

    const nextIngredientes =
      selectedItem.tab === 'ingredientes'
        ? item.ingredientes
            .filter((ingrediente) => ingrediente.id !== selectedItem.id)
            .map((ingrediente, index) => ({
              descricao: ingrediente.descricao,
              ordemExibicao: index,
            }))
        : item.ingredientes.map((ingrediente, index) => ({
            descricao: ingrediente.descricao,
            ordemExibicao: index,
          }));

    const nextModosPreparo =
      selectedItem.tab === 'modo-preparo'
        ? item.modosPreparo
            .filter((modo) => modo.id !== selectedItem.id)
            .sort((a, b) => a.numeroPasso - b.numeroPasso)
            .map((modo, index) => ({
              descricao: modo.descricao,
              numeroPasso: index + 1,
            }))
        : item.modosPreparo.map((modo) => ({
            descricao: modo.descricao,
            numeroPasso: modo.numeroPasso,
          }));

    try {
      const response = await api.put(`/receitas/${item.id}`, {
        nome: item.nome,
        descricao: item.descricao || '',
        imagem: item.imagem || '',
        tempoPreparo: item.tempoPreparo || '',
        ativo: true,
        categoriaId: item.categoriaId,
        ingredientes: nextIngredientes,
        modosPreparo: nextModosPreparo,
      });

      setItem(response.data);
      setSelectedItem(null);
    } catch {
      setError(
        selectedItem.tab === 'ingredientes'
          ? 'Nao foi possivel deletar o ingrediente.'
          : 'Nao foi possivel deletar o modo de preparo.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PublicScaffold
        title="Receita"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80"
        backTo="/receitas"
      >
        <PublicLoadingState message="Carregando receita..." />
      </PublicScaffold>
    );
  }

  if (!item) {
    return (
      <PublicScaffold
        title="Receita"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80"
        backTo="/receitas"
      >
        <PublicEmptyState message="Receita nao encontrada." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold
      title={item.nome}
      eyebrow="Receita"
      heroImage={item.imagem || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80'}
      backTo={`/receitas/categoria/${item.categoriaId}`}
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/50">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e5bc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a790c]">
              <SparkIcon />
              Conteudo da receita
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-800">Organize ingredientes e modo de preparo no mesmo padrao</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71695a]">
              Use as abas para manter o conteudo estruturado, com cadastro, edicao e exclusao dentro da mesma experiencia.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Resumo</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-800">
                  {activeTab === 'ingredientes' ? 'Ingredientes cadastrados' : 'Passos cadastrados'}
                </h3>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#f4e7bf] text-orange-500">
                <BookIcon />
              </span>
            </div>

            <p className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2430]">{tabItems.length}</p>
            <p className="mt-2 text-sm text-[#786f60]">
              {activeTab === 'ingredientes'
                ? 'Itens disponiveis para preparo.'
                : 'Etapas prontas para orientar o preparo.'}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 lg:min-w-[420px]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ingredientes');
                    setSelectedItem(null);
                  }}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'ingredientes'
                      ? 'bg-[#f2e5bc] text-[#8f6e08] shadow-[0_10px_24px_rgba(146,112,11,0.12)]'
                      : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Ingredientes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('modo-preparo');
                    setSelectedItem(null);
                  }}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'modo-preparo'
                      ? 'bg-[#f2e5bc] text-[#8f6e08] shadow-[0_10px_24px_rgba(146,112,11,0.12)]'
                      : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Modo de preparo
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {activeTab === 'ingredientes' ? 'Lista de ingredientes' : 'Etapas do preparo'}
                </h2>
                <p className="mt-1 text-sm text-[#776f61]">
                  {activeTab === 'ingredientes'
                    ? 'Cadastre, edite ou exclua os ingredientes da receita.'
                    : 'Cadastre, edite ou reorganize os passos do preparo.'}
                </p>
              </div>
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

          {error && (
            <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6">
            {tabItems.length === 0 ? (
              <PublicEmptyState
                message={
                  activeTab === 'ingredientes'
                    ? 'Nenhum ingrediente cadastrado para esta receita.'
                    : 'Nenhum modo de preparo cadastrado para esta receita.'
                }
              />
            ) : (
              <div className="space-y-3">
                {tabItems.map((tabItem, index) => {
                  const isSelected = selectedItem?.id === tabItem.id && selectedItem.tab === activeTab;

                  return (
                    <article
                      key={tabItem.id}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-md shadow-slate-200/50"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedItem(isSelected ? null : { id: tabItem.id, tab: activeTab })}
                        className="flex w-full items-start gap-4 text-left"
                      >
                        <span className="flex h-11 min-w-11 items-center justify-center rounded-[16px] bg-emerald-50 text-sm font-semibold text-orange-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="flex-1">
                          <span className="block text-lg font-semibold text-[#2f2f2f]">{tabItem.title}</span>
                          {tabItem.subtitle && <span className="mt-2 block text-sm leading-6 text-[#756e60]">{tabItem.subtitle}</span>}
                        </span>

                        <span className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                          {isSelected ? 'Ocultar acoes' : 'Mais acoes'}
                        </span>
                      </button>

                      {isSelected && (
                        <div className="mt-4 grid gap-2 rounded-[20px] border border-slate-200 bg-white p-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={openEditModal}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-slate-50"
                          >
                            <PencilIcon />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteItem()}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <TrashIcon />
                            Deletar
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(30,25,14,0.38)] px-4 py-8 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-[32px] border border-emerald-200 bg-slate-50 p-6 shadow-2xl shadow-emerald-900/5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  {editItemId ? 'Atualizacao' : 'Novo cadastro'}
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-800">
                  {activeTab === 'ingredientes'
                    ? editItemId
                      ? 'Atualizar ingrediente'
                      : 'Cadastrar ingrediente'
                    : editItemId
                      ? 'Atualizar modo de preparo'
                      : 'Cadastrar modo de preparo'}
                </h4>
                <p className="mt-2 text-sm text-[#736c5d]">
                  {activeTab === 'ingredientes'
                    ? 'Adicione ou ajuste os ingredientes dessa receita no mesmo padrao visual.'
                    : 'Cadastre ou reorganize os passos do modo de preparo no mesmo fluxo.'}
                </p>
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

            <form onSubmit={handleSaveItem} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                  {activeTab === 'ingredientes' ? 'Ingrediente' : 'Descricao do passo'}
                </label>
                <input
                  required
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  placeholder={activeTab === 'ingredientes' ? 'Digite o ingrediente' : 'Digite o modo de preparo'}
                />
              </div>

              {activeTab === 'modo-preparo' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder={`Ex: ${item.modosPreparo.length + 1}`}
                  />
                </div>
              )}

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
                  {saving ? 'Salvando...' : editItemId ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PublicScaffold>
  );
}

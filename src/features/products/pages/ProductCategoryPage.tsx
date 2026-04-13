import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  imagem?: string;
  recomendado?: boolean;
  semAcucar?: boolean;
  semGluten?: boolean;
  semLactose?: boolean;
  fonteProteina?: boolean;
  fonteGorduraBoa?: boolean;
  fonteFibra?: boolean;
  observacao?: string;
  ordemExibicao?: number;
  ativo?: boolean;
};

type Categoria = {
  id: number;
  nome: string;
  imagem?: string;
};

const initialFormState = {
  nome: '',
  descricao: '',
  imagem: '',
  recomendado: false,
  semAcucar: false,
  semGluten: false,
  semLactose: false,
  fonteProteina: false,
  fonteGorduraBoa: false,
  fonteFibra: false,
  observacao: '',
  ordemExibicao: '0',
  ativo: true,
};

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Nao foi possivel ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

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

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 4v16M4 8.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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

type ToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-medium text-[#5e5648]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 rounded-full transition ${
          checked ? 'bg-[#dac57b]' : 'bg-[#d8d0bf]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-[#b89614] transition ${checked ? 'left-8' : 'left-1'}`}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}

export function ProductCategoryPage() {
  const navigate = useNavigate();
  const { categoriaId } = useParams();
  const [items, setItems] = useState<Produto[]>([]);
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
        api.get(`/produtos?categoriaId=${categoriaId}`),
        api.get('/produtos/categorias'),
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      setError('Nao foi possivel carregar os produtos desta categoria.');
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

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => {
      const haystack = `${item.nome} ${item.descricao ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [items, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      ...initialFormState,
      imagem: currentCategory?.imagem || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData(initialFormState);
    setError('');
  };

  const openEditModal = async (productId: number) => {
    try {
      const response = await api.get(`/produtos/${productId}`);
      const product = response.data as Produto;

      setEditId(product.id);
      setFormData({
        nome: product.nome || '',
        descricao: product.descricao || '',
        imagem: product.imagem || '',
        recomendado: product.recomendado ?? false,
        semAcucar: product.semAcucar ?? false,
        semGluten: product.semGluten ?? false,
        semLactose: product.semLactose ?? false,
        fonteProteina: product.fonteProteina ?? false,
        fonteGorduraBoa: product.fonteGorduraBoa ?? false,
        fonteFibra: product.fonteFibra ?? false,
        observacao: product.observacao || '',
        ordemExibicao: String(product.ordemExibicao ?? 0),
        ativo: product.ativo ?? true,
      });
      setError('');
      setIsModalOpen(true);
    } catch {
      setError('Nao foi possivel carregar o produto para edicao.');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Deseja inativar este produto?')) return;

    try {
      await api.delete(`/produtos/${productId}`);
      if (selectedId === productId) {
        setSelectedId(null);
      }
      await fetchData();
    } catch {
      setError('Nao foi possivel inativar o produto.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numericCategoryId) {
      setError('Categoria invalida.');
      return;
    }

    if (!formData.nome.trim()) {
      setError('Informe o nome do produto.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      categoriaId: numericCategoryId,
      ordemExibicao: Number(formData.ordemExibicao || 0),
    };

    try {
      if (editId) {
        await api.put(`/produtos/${editId}`, payload);
      } else {
        await api.post('/produtos', payload);
      }

      await fetchData();
      closeModal();
    } catch {
      setError(editId ? 'Nao foi possivel atualizar o produto.' : 'Nao foi possivel cadastrar o produto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PublicScaffold
      title={currentCategory ? `Produtos - ${currentCategory.nome}` : 'Produtos'}
      eyebrow="Categoria"
      heroImage="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80"
      backTo="/produtos"
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-[#eadfbe] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] p-5 shadow-[0_14px_36px_rgba(92,68,11,0.06)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e5bc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a790c]">
              <SparkIcon />
              Catalogo da categoria
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[#2d2d2d]">
              Gerencie os produtos de {currentCategory?.nome || 'uma categoria'} no mesmo fluxo
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71695a]">
              Busque produtos, abra detalhes, edite cadastros ou inative itens sem sair da mesma experiencia.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#eadfbe] bg-white p-5 shadow-[0_14px_36px_rgba(92,68,11,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Resumo</p>
                <h3 className="mt-2 text-lg font-semibold text-[#2d2d2d]">Produtos disponiveis</h3>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#f4e7bf] text-[#8e6c09]">
                <BoxIcon />
              </span>
            </div>

            <p className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2430]">
              {loading ? '--' : filteredItems.length}
            </p>
            <p className="mt-2 text-sm text-[#786f60]">
              {search ? 'Resultados filtrados para a sua busca.' : 'Produtos prontos para consulta e manutencao.'}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadfbe] bg-white p-5 shadow-[0_14px_36px_rgba(92,68,11,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#2d2d2d]">Produtos da categoria</h2>
              <p className="mt-1 text-sm text-[#776f61]">Abra o produto, ajuste informacoes ou cadastre novos itens diretamente nesta tela.</p>
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
              <PublicLoadingState message="Carregando produtos..." />
            ) : filteredItems.length === 0 ? (
              <PublicEmptyState message="Nenhum produto encontrado nesta categoria." />
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item, index) => {
                  const isSelected = selectedId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-[#eadfbe] bg-[linear-gradient(180deg,#fffdfa_0%,#faf4e4_100%)] p-5 shadow-[0_12px_28px_rgba(98,74,13,0.05)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <button
                          type="button"
                          onClick={() => navigate(`/produtos/${item.id}`)}
                          className="flex flex-1 items-start gap-4 text-left"
                        >
                          <span className="flex h-11 min-w-11 items-center justify-center rounded-[16px] bg-[#f3e6bb] text-sm font-semibold text-[#8e6c09]">
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
                              {item.recomendado && (
                                <span className="rounded-full bg-[#f4e7bf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8e6c09]">
                                  Destaque
                                </span>
                              )}
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-[#756e60]">
                              {item.descricao || 'Abra este produto para visualizar os detalhes cadastrados.'}
                            </span>
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/produtos/${item.id}`)}
                            className="rounded-full border border-[#d8c26d] bg-white px-4 py-2 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                          >
                            Detalhe
                          </button>
                          <button
                            type="button"
                            onClick={() => void openEditModal(item.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-[#d4c27b] bg-[#fbf6e4] px-4 py-2 text-sm font-semibold text-[#836509] transition hover:bg-[#f5ebc6]"
                          >
                            <PencilIcon />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedId(isSelected ? null : item.id)}
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
                            onClick={() => navigate(`/produtos/${item.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4c27b] bg-white px-4 py-3 text-sm font-semibold text-[#7b620c] transition hover:bg-[#fbf6e4]"
                          >
                            <BoxIcon />
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
          <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center">
            <div className="my-auto w-full max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-[#dcc77c] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1df_100%)] shadow-[0_28px_80px_rgba(53,40,10,0.18)] sm:max-h-[calc(100vh-4rem)]">
              <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-4rem)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a4810d]">
                  {editId ? 'Atualizacao' : 'Novo cadastro'}
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-[#2b2b2b]">
                  {editId ? 'Atualizar produto da categoria' : 'Cadastrar produto da categoria'}
                </h4>
                <p className="mt-2 text-sm text-[#736c5d]">
                  {currentCategory?.nome
                    ? `O produto sera vinculado automaticamente a categoria ${currentCategory.nome}.`
                    : 'O produto sera vinculado automaticamente a categoria atual.'}
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
                  placeholder="Digite o nome do produto"
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
                  placeholder="Digite a descricao"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                  Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const imageData = await fileToDataUrl(file);
                      setFormData({ ...formData, imagem: imageData });
                    } catch {
                      setError('Nao foi possivel carregar a foto.');
                    }
                  }}
                  className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] file:mr-3 file:rounded-full file:border-0 file:bg-[#f2e5bc] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#8e6c09] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                />
                {formData.imagem && (
                  <img src={formData.imagem} alt="Preview do produto" className="mt-4 h-40 w-full rounded-[20px] object-cover" />
                )}
              </div>

              <div className="grid gap-4 rounded-[24px] border border-[#eadfbe] bg-white/80 p-5">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                  <ToggleField
                    label="Destaque"
                    checked={formData.recomendado}
                    onChange={(checked) => setFormData({ ...formData, recomendado: checked })}
                  />
                  <ToggleField
                    label="Ativo"
                    checked={formData.ativo}
                    onChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                  <ToggleField
                    label="Sem Acucar"
                    checked={formData.semAcucar}
                    onChange={(checked) => setFormData({ ...formData, semAcucar: checked })}
                  />
                  <ToggleField
                    label="Sem Gluten"
                    checked={formData.semGluten}
                    onChange={(checked) => setFormData({ ...formData, semGluten: checked })}
                  />
                  <ToggleField
                    label="Sem Lactose"
                    checked={formData.semLactose}
                    onChange={(checked) => setFormData({ ...formData, semLactose: checked })}
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                  <ToggleField
                    label="Fonte Proteina"
                    checked={formData.fonteProteina}
                    onChange={(checked) => setFormData({ ...formData, fonteProteina: checked })}
                  />
                  <ToggleField
                    label="Fonte Gordura Boa"
                    checked={formData.fonteGorduraBoa}
                    onChange={(checked) => setFormData({ ...formData, fonteGorduraBoa: checked })}
                  />
                  <ToggleField
                    label="Fonte de Fibra"
                    checked={formData.fonteFibra}
                    onChange={(checked) => setFormData({ ...formData, fonteFibra: checked })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">
                  Observacao
                </label>
                <textarea
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  rows={3}
                  className="w-full rounded-[20px] border border-[#dccd98] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#c7a43b] focus:ring-2 focus:ring-[#ead58d]"
                  placeholder="Digite uma observacao complementar"
                />
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
                  {saving ? 'Salvando...' : editId ? 'Atualizar produto' : 'Cadastrar produto'}
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

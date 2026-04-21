import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Cupom = {
  codigo: string;
  descricao: string;
  validade: string;
};

type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
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
  ordemExibicao?: number;
  ativo?: boolean;
  categoria?: Categoria;
  cupons?: Array<{
    codigo?: string;
    descricao?: string;
    validade?: string;
  }>;
};

const initialFormState = {
  nome: '',
  produto: '',
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3l1.8 4.7L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 9.5 5.4 5h13.2L20 9.5v1a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 12 12a2.5 2.5 0 0 1-3.5 0A2.5 2.5 0 0 1 4 10.5v-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 12.5V19h12v-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M9.5 14.5 14.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 16H6.5A3.5 3.5 0 0 1 3 12.5 3.5 3.5 0 0 1 6.5 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 8h1.5A3.5 3.5 0 0 1 21 11.5 3.5 3.5 0 0 1 17.5 15H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FornecedorCategoryPage() {
  const navigate = useNavigate();
  const { categoriaId } = useParams();
  const [items, setItems] = useState<Fornecedor[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [cupons, setCupons] = useState<Cupom[]>([]);

  const numericCategoryId = Number(categoriaId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get(`/fornecedores?categoriaId=${categoriaId}`),
        api.get('/fornecedores/categorias'),
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      setError('Nao foi possivel carregar os fornecedores desta categoria.');
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
      const haystack = `${item.nome} ${item.descricaoCurta ?? ''} ${item.endereco ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [items, search]);

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setCupons([]);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setCupons([]);
    setError('');
    setIsModalOpen(false);
  };

  const openEditModal = async (supplierId: number) => {
    try {
      const response = await api.get(`/fornecedores/${supplierId}`);
      const supplier = response.data as Fornecedor;

      setEditId(supplier.id);
      setFormData({
        nome: supplier.nome || '',
        produto: supplier.descricaoCurta || '',
        descricaoCurta: supplier.descricaoDetalhada || '',
        telefone: supplier.telefone || '',
        whatsapp: Boolean(supplier.whatsapp),
        instagram: supplier.instagram || '',
        ativo: supplier.ativo ?? true,
      });
      setCupons(
        (supplier.cupons || []).map((cupom) => ({
          codigo: cupom.codigo || '',
          descricao: cupom.descricao || '',
          validade: cupom.validade ? String(cupom.validade).slice(0, 10) : '',
        }))
      );
      setError('');
      setIsModalOpen(true);
    } catch {
      setError('Nao foi possivel carregar o fornecedor para edicao.');
    }
  };

  const handleDelete = async (supplierId: number) => {
    if (!confirm('Deseja inativar este fornecedor?')) return;

    try {
      await api.delete(`/fornecedores/${supplierId}`);
      if (selectedId === supplierId) {
        setSelectedId(null);
      }
      await fetchData();
    } catch {
      setError('Nao foi possivel inativar o fornecedor.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!numericCategoryId) {
      setError('Categoria invalida.');
      return;
    }

    if (!formData.nome.trim()) {
      setError('Informe o nome do fornecedor.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      nome: formData.nome,
      descricaoCurta: formData.produto,
      descricaoDetalhada: formData.descricaoCurta,
      telefone: formData.telefone,
      whatsapp: formData.whatsapp ? 'Sim' : '',
      instagram: formData.instagram,
      ativo: formData.ativo,
      categoriaId: numericCategoryId,
      ordemExibicao: 0,
      cupons: cupons.filter((cupom) => cupom.codigo.trim()),
    };

    try {
      if (editId) {
        await api.put(`/fornecedores/${editId}`, payload);
      } else {
        await api.post('/fornecedores', payload);
      }

      await fetchData();
      closeModal();
    } catch {
      setError(editId ? 'Nao foi possivel atualizar o fornecedor.' : 'Nao foi possivel cadastrar o fornecedor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PublicScaffold
      title={currentCategory ? `Fornecedores - ${currentCategory.nome}` : 'Fornecedores'}
      eyebrow="Categoria"
      heroImage="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80"
      backTo="/fornecedores"
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/50">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e5bc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a790c]">
              <SparkIcon />
              Base de parceiros
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-800">
              Gerencie os fornecedores de {currentCategory?.nome || 'uma categoria'} no mesmo fluxo
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71695a]">
              Cadastre fornecedores, mantenha os dados de contato acessiveis e adicione cupons sem sair da tela da categoria.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7d11]">Resumo</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-800">Fornecedores disponiveis</h3>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#f4e7bf] text-orange-500">
                <StoreIcon />
              </span>
            </div>

            <p className="mt-6 text-4xl font-semibold tracking-tight text-[#1f2430]">
              {loading ? '--' : filteredItems.length}
            </p>
            <p className="mt-2 text-sm text-[#786f60]">
              {search ? 'Resultados filtrados para a sua busca.' : 'Parceiros prontos para consulta e manutencao.'}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Fornecedores da categoria</h2>
              <p className="mt-1 text-sm text-[#776f61]">Abra detalhes, edite dados de contato ou cadastre novos parceiros diretamente desta tela.</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative w-full sm:min-w-[320px]">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a2810d]">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, resumo ou endereco"
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
              <PublicLoadingState message="Carregando fornecedores..." />
            ) : filteredItems.length === 0 ? (
              <PublicEmptyState message="Nenhum fornecedor encontrado nesta categoria." />
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
                          onClick={() => navigate(`/fornecedores/${item.id}`)}
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
                              {item.descricaoCurta || 'Abra o detalhe para visualizar as informacoes completas deste parceiro.'}
                            </span>
                            {item.descricaoDetalhada && (
                              <span className="mt-2 block text-sm leading-6 text-[#8a7e65]">
                                {item.descricaoDetalhada}
                              </span>
                            )}
                            {(item.telefone || item.whatsapp || item.instagram) && (
                              <span className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#88734c]">
                                {item.telefone && <span className="rounded-full bg-[#f7efdb] px-3 py-1">Telefone: {item.telefone}</span>}
                                <span className="rounded-full bg-[#f7efdb] px-3 py-1">WhatsApp: {item.whatsapp ? 'Sim' : 'Nao'}</span>
                                {item.instagram && <span className="rounded-full bg-[#f7efdb] px-3 py-1">Instagram: {item.instagram}</span>}
                              </span>
                            )}
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/fornecedores/${item.id}`)}
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
                            onClick={() => navigate(`/fornecedores/${item.id}`)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50"
                          >
                            <LinkIcon />
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
            <div className="my-auto w-full max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-emerald-200 bg-slate-50 shadow-2xl shadow-emerald-900/5 sm:max-h-[calc(100vh-4rem)]">
              <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-4rem)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                      {editId ? 'Atualizacao' : 'Novo cadastro'}
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-slate-800">
                      {editId ? 'Atualizar fornecedor da categoria' : 'Cadastrar fornecedor da categoria'}
                    </h4>
                    <p className="mt-2 text-sm text-[#736c5d]">
                      {currentCategory?.nome
                        ? `O fornecedor sera vinculado automaticamente a categoria ${currentCategory.nome}.`
                        : 'O fornecedor sera vinculado automaticamente a categoria atual.'}
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

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Nome</label>
                      <input
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                        placeholder="Digite o nome do fornecedor"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Produto</label>
                      <input
                        value={formData.produto}
                        onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                        className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                        placeholder="Ex: Marmitas, bolos, suplementos"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Descricao</label>
                      <textarea
                        value={formData.descricaoCurta}
                        onChange={(e) => setFormData({ ...formData, descricaoCurta: e.target.value })}
                        rows={4}
                        className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                        placeholder="Descreva o fornecedor e o que ele oferece"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Telefone</label>
                      <input
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                        placeholder="Telefone principal"
                      />
                    </div>

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

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#817661]">Instagram</label>
                      <input
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                        placeholder="@perfil"
                      />
                    </div>

                    <div className="rounded-[24px] border border-[#e7d9aa] bg-white/70 px-4 py-4 sm:col-span-2">
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
                        <span>{formData.ativo ? 'Fornecedor ativo' : 'Fornecedor inativo'}</span>
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
                      {saving ? 'Salvando...' : editId ? 'Atualizar fornecedor' : 'Cadastrar fornecedor'}
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

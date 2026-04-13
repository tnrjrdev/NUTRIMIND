import { useEffect, useState } from 'react';
import { AdminCategoryManager } from '../components/AdminCategoryManager';
import { api } from '../../../services/api';

type Categoria = { id: number; nome: string };
type Produto = {
  id: number;
  nome: string;
  marca?: string;
  descricao?: string;
  imagem?: string;
  recomendado: boolean;
  categoria?: Categoria;
};

const initialForm = {
  nome: '',
  marca: '',
  descricao: '',
  imagem: '',
  categoriaId: '',
  recomendado: false,
  ordemExibicao: '0',
  ativo: true,
};

export function ProdutosAdminPage() {
  const [items, setItems] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  const fetchData = async () => {
    const [itemsRes, categoriasRes] = await Promise.all([
      api.get('/produtos'),
      api.get('/produtos/categorias'),
    ]);
    setItems(itemsRes.data);
    setCategorias(categoriasRes.data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    void load();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData(initialForm);
    setViewState('list');
  };

  const handleEdit = (item: Produto) => {
    setEditId(item.id);
    setFormData({
      nome: item.nome,
      marca: item.marca || '',
      descricao: item.descricao || '',
      imagem: item.imagem || '',
      categoriaId: String(item.categoria?.id || ''),
      recomendado: item.recomendado,
      ordemExibicao: '0',
      ativo: true,
    });
    setViewState('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/produtos/${editId}`, formData);
    else await api.post('/produtos', formData);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar o item?')) return;
    await api.delete(`/produtos/${id}`);
    fetchData();
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{editId ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button onClick={resetForm} className="rounded border px-4 py-2">Voltar</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome" className="rounded border p-2" />
            <select required value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })} className="rounded border p-2">
              <option value="">Selecione a categoria</option>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
            </select>
            <input value={formData.marca} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} placeholder="Marca" className="rounded border p-2" />
            <input value={formData.imagem} onChange={(e) => setFormData({ ...formData, imagem: e.target.value })} placeholder="URL da imagem" className="rounded border p-2" />
          </div>
          <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" rows={4} className="w-full rounded border p-2" />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={formData.recomendado} onChange={(e) => setFormData({ ...formData, recomendado: e.target.checked })} />
            Produto recomendado
          </label>
          <button type="submit" className="w-full rounded bg-[#b78b03] py-3 text-white">{editId ? 'Salvar produto' : 'Criar produto'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Produtos</h3>
        <button onClick={() => setViewState('form')} className="rounded bg-[#b78b03] px-4 py-2 text-sm text-white">+ Novo produto</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Nome</th><th className="p-4">Categoria</th><th className="p-4">Ações</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.nome}</td>
                <td className="p-4">{item.categoria?.nome}</td>
                <td className="p-4"><button onClick={() => handleEdit(item)} className="mr-3 text-blue-600">Editar</button><button onClick={() => handleDelete(item.id)} className="text-red-500">Inativar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminCategoryManager title="Categorias de Produtos" endpoint="/produtos/categorias" />
    </div>
  );
}

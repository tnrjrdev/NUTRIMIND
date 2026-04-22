import { useEffect, useState } from 'react';
import { AdminCategoryManager } from '../components/AdminCategoryManager';
import { api } from '../../../services/api';

type Categoria = { id: number; nome: string };
type Cha = {
  id: number;
  nome: string;
  formaUtilizacao?: string;
  posologia?: string;
  contraindicacoes?: string;
  observacoes?: string;
  categoria?: Categoria;
};

const initialForm = {
  nome: '',
  formaUtilizacao: '',
  posologia: '',
  contraindicacoes: '',
  observacoes: '',
  categoriaId: '',
  ordemExibicao: '0',
  ativo: true,
};

export function ChasAdminPage() {
  const [items, setItems] = useState<Cha[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  const fetchData = async () => {
    const [itemsRes, categoriasRes] = await Promise.all([
      api.get('/chas'),
      api.get('/chas/categorias'),
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

  const handleEdit = (item: Cha) => {
    setEditId(item.id);
    setFormData({
      nome: item.nome,
      formaUtilizacao: item.formaUtilizacao || '',
      posologia: item.posologia || '',
      contraindicacoes: item.contraindicacoes || '',
      observacoes: item.observacoes || '',
      categoriaId: String(item.categoria?.id || ''),
      ordemExibicao: '0',
      ativo: true,
    });
    setViewState('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/chas/${editId}`, formData);
    else await api.post('/chas', formData);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar o item?')) return;
    await api.delete(`/chas/${id}`);
    fetchData();
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{editId ? 'Editar Chá' : 'Novo Chá'}</h3>
          <button onClick={resetForm} className="rounded border px-4 py-2">Voltar</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome" className="rounded border p-2" />
            <select required value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })} className="rounded border p-2">
              <option value="">Selecione a categoria</option>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
            </select>
          </div>
          <textarea value={formData.formaUtilizacao} onChange={(e) => setFormData({ ...formData, formaUtilizacao: e.target.value })} placeholder="Forma de utilização" rows={3} className="w-full rounded border p-2" />
          <textarea value={formData.posologia} onChange={(e) => setFormData({ ...formData, posologia: e.target.value })} placeholder="Posologia" rows={3} className="w-full rounded border p-2" />
          <textarea value={formData.contraindicacoes} onChange={(e) => setFormData({ ...formData, contraindicacoes: e.target.value })} placeholder="Contraindicações" rows={3} className="w-full rounded border p-2" />
          <textarea value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} placeholder="Observações" rows={3} className="w-full rounded border p-2" />
          <button type="submit" className="w-full rounded bg-emerald-500 py-3 text-white">{editId ? 'Salvar chá' : 'Criar chá'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Chás</h3>
        <button onClick={() => setViewState('form')} className="rounded bg-emerald-500 px-4 py-2 text-sm text-white">+ Novo chá</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Chá</th><th className="p-4">Categoria</th><th className="p-4">Ações</th></tr></thead>
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
      <AdminCategoryManager title="Categorias de Chás" endpoint="/chas/categorias" />
    </div>
  );
}

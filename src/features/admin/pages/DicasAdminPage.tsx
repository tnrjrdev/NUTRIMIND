import { useEffect, useState } from 'react';
import { api } from '../../../services/api';

type Dica = {
  id: number;
  texto: string;
  icone?: string;
};

const initialForm = {
  texto: '',
  icone: '',
  ordemExibicao: '0',
  ativo: true,
};

export function DicasAdminPage() {
  const [items, setItems] = useState<Dica[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  const fetchData = async () => {
    const response = await api.get('/dicas');
    setItems(response.data);
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

  const handleEdit = (item: Dica) => {
    setEditId(item.id);
    setFormData({ texto: item.texto, icone: item.icone || '', ordemExibicao: '0', ativo: true });
    setViewState('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/dicas/${editId}`, formData);
    else await api.post('/dicas', formData);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar a dica?')) return;
    await api.delete(`/dicas/${id}`);
    fetchData();
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{editId ? 'Editar Dica' : 'Nova Dica'}</h3>
          <button onClick={resetForm} className="rounded border px-4 py-2">Voltar</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea required value={formData.texto} onChange={(e) => setFormData({ ...formData, texto: e.target.value })} rows={5} placeholder="Texto da dica" className="w-full rounded border p-2" />
          <input value={formData.icone} onChange={(e) => setFormData({ ...formData, icone: e.target.value })} placeholder="Ícone" className="w-full rounded border p-2" />
          <button type="submit" className="w-full rounded bg-emerald-500 py-3 text-white">{editId ? 'Salvar dica' : 'Criar dica'}</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Dicas</h3>
        <button onClick={() => setViewState('form')} className="rounded bg-emerald-500 px-4 py-2 text-sm text-white">+ Nova dica</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Texto</th><th className="p-4">Ícone</th><th className="p-4">Ações</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.texto}</td>
                <td className="p-4">{item.icone}</td>
                <td className="p-4"><button onClick={() => handleEdit(item)} className="mr-3 text-blue-600">Editar</button><button onClick={() => handleDelete(item.id)} className="text-red-500">Inativar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

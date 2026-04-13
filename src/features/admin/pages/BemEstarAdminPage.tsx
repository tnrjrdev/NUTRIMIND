import { useEffect, useState } from 'react';
import { api } from '../../../services/api';

type Item = {
  id: number;
  nome: string;
  descricaoCurta?: string;
  descricaoDetalhada?: string;
  instagram?: string;
  site?: string;
  midiaUrl?: string;
};

const initialForm = {
  nome: '',
  descricaoCurta: '',
  descricaoDetalhada: '',
  instagram: '',
  site: '',
  midiaUrl: '',
  ordemExibicao: '0',
  ativo: true,
};

export function BemEstarAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  const fetchData = async () => {
    const response = await api.get('/bem-estar');
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

  const handleEdit = (item: Item) => {
    setEditId(item.id);
    setFormData({
      nome: item.nome,
      descricaoCurta: item.descricaoCurta || '',
      descricaoDetalhada: item.descricaoDetalhada || '',
      instagram: item.instagram || '',
      site: item.site || '',
      midiaUrl: item.midiaUrl || '',
      ordemExibicao: '0',
      ativo: true,
    });
    setViewState('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/bem-estar/${editId}`, formData);
    else await api.post('/bem-estar', formData);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar o item?')) return;
    await api.delete(`/bem-estar/${id}`);
    fetchData();
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{editId ? 'Editar Indicação' : 'Nova Indicação'}</h3>
          <button onClick={resetForm} className="rounded border px-4 py-2">Voltar</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome" className="w-full rounded border p-2" />
          <textarea value={formData.descricaoCurta} onChange={(e) => setFormData({ ...formData, descricaoCurta: e.target.value })} placeholder="Descrição curta" rows={2} className="w-full rounded border p-2" />
          <textarea value={formData.descricaoDetalhada} onChange={(e) => setFormData({ ...formData, descricaoDetalhada: e.target.value })} placeholder="Descrição detalhada" rows={4} className="w-full rounded border p-2" />
          <div className="grid gap-4 md:grid-cols-3">
            <input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="Instagram" className="rounded border p-2" />
            <input value={formData.site} onChange={(e) => setFormData({ ...formData, site: e.target.value })} placeholder="Site" className="rounded border p-2" />
            <input value={formData.midiaUrl} onChange={(e) => setFormData({ ...formData, midiaUrl: e.target.value })} placeholder="URL de mídia" className="rounded border p-2" />
          </div>
          <button type="submit" className="w-full rounded bg-[#b78b03] py-3 text-white">{editId ? 'Salvar indicação' : 'Criar indicação'}</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Bem-Estar</h3>
        <button onClick={() => setViewState('form')} className="rounded bg-[#b78b03] px-4 py-2 text-sm text-white">+ Nova indicação</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Nome</th><th className="p-4">Resumo</th><th className="p-4">Ações</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.nome}</td>
                <td className="p-4">{item.descricaoCurta}</td>
                <td className="p-4"><button onClick={() => handleEdit(item)} className="mr-3 text-blue-600">Editar</button><button onClick={() => handleDelete(item.id)} className="text-red-500">Inativar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { AdminCategoryManager } from '../components/AdminCategoryManager';
import { api } from '../../../services/api';

type Categoria = { id: number; nome: string };
type Cupom = { codigo: string; descricao: string; validade: string };
type FornecedorDetalhe = Fornecedor & {
  categoria?: Categoria & { id: number };
  descricaoDetalhada?: string;
  endereco?: string;
  instagram?: string;
  site?: string;
  ordemExibicao?: number;
  ativo?: boolean;
  cupons?: Array<{
    codigo?: string;
    descricao?: string;
    validade?: string;
  }>;
};
type Fornecedor = {
  id: number;
  nome: string;
  categoria?: Categoria;
  descricaoCurta?: string;
  telefone?: string;
  whatsapp?: string;
};

const initialForm = {
  nome: '',
  categoriaId: '',
  descricaoCurta: '',
  descricaoDetalhada: '',
  endereco: '',
  telefone: '',
  whatsapp: '',
  instagram: '',
  site: '',
  ordemExibicao: '0',
  ativo: true,
};

export function FornecedoresAdminPage() {
  const [items, setItems] = useState<Fornecedor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  const fetchData = async () => {
    const [itemsRes, categoriasRes] = await Promise.all([
      api.get('/fornecedores'),
      api.get('/fornecedores/categorias'),
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
    setCupons([]);
    setViewState('list');
  };

  const handleEdit = async (item: Fornecedor) => {
    const response = await api.get(`/fornecedores/${item.id}`);
    const fornecedor: FornecedorDetalhe = response.data;
    setEditId(fornecedor.id);
    setFormData({
      nome: fornecedor.nome,
      categoriaId: String(fornecedor.categoria?.id || ''),
      descricaoCurta: fornecedor.descricaoCurta || '',
      descricaoDetalhada: fornecedor.descricaoDetalhada || '',
      endereco: fornecedor.endereco || '',
      telefone: fornecedor.telefone || '',
      whatsapp: fornecedor.whatsapp || '',
      instagram: fornecedor.instagram || '',
      site: fornecedor.site || '',
      ordemExibicao: String(fornecedor.ordemExibicao ?? 0),
      ativo: fornecedor.ativo ?? true,
    });
    setCupons(
      (fornecedor.cupons || []).map((cupom) => ({
        codigo: cupom.codigo || '',
        descricao: cupom.descricao || '',
        validade: cupom.validade ? String(cupom.validade).slice(0, 10) : '',
      }))
    );
    setViewState('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, cupons };
    if (editId) await api.put(`/fornecedores/${editId}`, payload);
    else await api.post('/fornecedores', payload);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar o fornecedor?')) return;
    await api.delete(`/fornecedores/${id}`);
    fetchData();
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{editId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
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
          <textarea value={formData.descricaoCurta} onChange={(e) => setFormData({ ...formData, descricaoCurta: e.target.value })} rows={2} placeholder="Descrição curta" className="w-full rounded border p-2" />
          <textarea value={formData.descricaoDetalhada} onChange={(e) => setFormData({ ...formData, descricaoDetalhada: e.target.value })} rows={4} placeholder="Descrição detalhada" className="w-full rounded border p-2" />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} placeholder="Endereço" className="rounded border p-2" />
            <input value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} placeholder="Telefone" className="rounded border p-2" />
            <input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="WhatsApp" className="rounded border p-2" />
            <input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="Instagram" className="rounded border p-2" />
            <input value={formData.site} onChange={(e) => setFormData({ ...formData, site: e.target.value })} placeholder="Site" className="rounded border p-2 md:col-span-2" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Cupons</h4>
              <button type="button" onClick={() => setCupons([...cupons, { codigo: '', descricao: '', validade: '' }])} className="rounded bg-slate-200 px-3 py-1 text-xs">+ Cupom</button>
            </div>
            <div className="space-y-3">
              {cupons.map((cupom, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-3">
                  <input value={cupom.codigo} onChange={(e) => { const next = [...cupons]; next[index].codigo = e.target.value; setCupons(next); }} placeholder="Código" className="rounded border p-2" />
                  <input value={cupom.descricao} onChange={(e) => { const next = [...cupons]; next[index].descricao = e.target.value; setCupons(next); }} placeholder="Descrição" className="rounded border p-2" />
                  <div className="flex gap-2">
                    <input type="date" value={cupom.validade} onChange={(e) => { const next = [...cupons]; next[index].validade = e.target.value; setCupons(next); }} className="flex-1 rounded border p-2" />
                    <button type="button" onClick={() => setCupons(cupons.filter((_, currentIndex) => currentIndex !== index))} className="rounded border px-3">x</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full rounded bg-[#b78b03] py-3 text-white">{editId ? 'Salvar fornecedor' : 'Criar fornecedor'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Fornecedores</h3>
        <button onClick={() => setViewState('form')} className="rounded bg-[#b78b03] px-4 py-2 text-sm text-white">+ Novo fornecedor</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Nome</th><th className="p-4">Categoria</th><th className="p-4">Contato</th><th className="p-4">Ações</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.nome}</td>
                <td className="p-4">{item.categoria?.nome}</td>
                <td className="p-4">{item.telefone || item.whatsapp || '-'}</td>
                <td className="p-4"><button onClick={() => handleEdit(item)} className="mr-3 text-blue-600">Editar</button><button onClick={() => handleDelete(item.id)} className="text-red-500">Inativar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminCategoryManager title="Categorias de Fornecedores" endpoint="/fornecedores/categorias" />
    </div>
  );
}

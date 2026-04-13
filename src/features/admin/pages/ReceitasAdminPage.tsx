import { useState, useEffect } from 'react';
import { AdminCategoryManager } from '../components/AdminCategoryManager';
import { api } from '../../../services/api';

interface Categoria {
  id: number;
  nome: string;
}

interface Ingrediente {
  id?: number;
  descricao: string;
}

interface ModoPreparo {
  id?: number;
  numeroPasso?: number;
  descricao: string;
}

interface Receita {
  id: number;
  nome: string;
  categoria: Categoria;
  tempoPreparo: string;
  ativo: boolean;
  imagem: string;
  descricao: string;
  ingredientes: Ingrediente[];
  modosPreparo: ModoPreparo[];
}

export function ReceitasAdminPage() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    tempoPreparo: '',
    categoriaId: '',
    ativo: true,
  });
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [modosPreparo, setModosPreparo] = useState<ModoPreparo[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, catRes] = await Promise.all([
        api.get('/receitas'),
        api.get('/receitas/categorias')
      ]);
      setReceitas(recRes.data);
      setCategorias(catRes.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ nome: '', descricao: '', imagem: '', tempoPreparo: '', categoriaId: '', ativo: true });
    setIngredientes([]);
    setModosPreparo([]);
    setViewState('list');
    setError('');
  };

  const handleEdit = (rec: Receita) => {
    setEditId(rec.id);
    setFormData({
      nome: rec.nome,
      descricao: rec.descricao || '',
      imagem: rec.imagem || '',
      tempoPreparo: rec.tempoPreparo || '',
      categoriaId: String(rec.categoria?.id || ''),
      ativo: rec.ativo,
    });
    setIngredientes(rec.ingredientes.map(i => ({ descricao: i.descricao })));
    setModosPreparo(rec.modosPreparo.map(m => ({ descricao: m.descricao })));
    setViewState('form');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar esta receita?')) return;
    try {
      await api.delete(`/receitas/${id}`);
      fetchData();
    } catch {
      alert('Erro ao excluir.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoriaId) return setError('Selecione uma categoria.');
    if (ingredientes.length === 0) return setError('Adicione pelo menos um ingrediente.');
    if (modosPreparo.length === 0) return setError('Adicione pelo menos um modo de preparo.');

    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      ingredientes,
      modosPreparo
    };

    try {
      if (editId) {
        await api.put(`/receitas/${editId}`, payload);
      } else {
        await api.post('/receitas', payload);
      }
      resetForm();
      fetchData();
    } catch {
      setError('Erro ao salvar receita.');
      setLoading(false);
    }
  };

  if (viewState === 'form') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold text-slate-800">{editId ? 'Editar Receita' : 'Nova Receita'}</h3>
          <button onClick={resetForm} className="text-sm font-medium text-slate-500 hover:text-slate-800 px-4 py-2 border rounded-lg">Voltar</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome da Receita *</label>
              <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border p-2 rounded bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoria *</label>
              <select required value={formData.categoriaId} onChange={e => setFormData({...formData, categoriaId: e.target.value})} className="w-full border p-2 rounded bg-slate-50">
                <option value="">Selecione...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tempo de Preparo</label>
              <input value={formData.tempoPreparo} onChange={e => setFormData({...formData, tempoPreparo: e.target.value})} placeholder="Ex: 30 minutos" className="w-full border p-2 rounded bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">URL da Imagem</label>
              <input value={formData.imagem} onChange={e => setFormData({...formData, imagem: e.target.value})} type="url" placeholder="https://..." className="w-full border p-2 rounded bg-slate-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Breve Descrição</label>
            <textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} rows={2} className="w-full border p-2 rounded bg-slate-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            {/* Ingredientes */}
            <div className="border rounded-lg p-4 bg-amber-50/50">
              <h4 className="font-semibold text-amber-900 mb-3 flex justify-between items-center">
                Ingredientes
                <button type="button" onClick={() => setIngredientes([...ingredientes, { descricao: '' }])} className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">+ Adicionar</button>
              </h4>
              <div className="space-y-2">
                {ingredientes.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input required value={ing.descricao} onChange={e => { const n = [...ingredientes]; n[i].descricao = e.target.value; setIngredientes(n); }} placeholder={`Ingrediente ${i + 1}`} className="flex-1 border p-1 rounded text-sm" />
                    <button type="button" onClick={() => setIngredientes(ingredientes.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-bold hover:bg-red-50 rounded">×</button>
                  </div>
                ))}
                {ingredientes.length === 0 && <p className="text-xs text-amber-700/50 italic">Nenhum ingrediente adicionado.</p>}
              </div>
            </div>

            {/* Modos de Preparo */}
            <div className="border rounded-lg p-4 bg-slate-50">
              <h4 className="font-semibold text-slate-700 mb-3 flex justify-between items-center">
                Modo de Preparo
                <button type="button" onClick={() => setModosPreparo([...modosPreparo, { descricao: '' }])} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">+ Adicionar</button>
              </h4>
              <div className="space-y-2">
                {modosPreparo.map((mod, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="bg-slate-200 text-slate-500 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">{i + 1}</span>
                    <input required value={mod.descricao} onChange={e => { const n = [...modosPreparo]; n[i].descricao = e.target.value; setModosPreparo(n); }} placeholder={`Passo ${i + 1}`} className="flex-1 border p-1 rounded text-sm" />
                    <button type="button" onClick={() => setModosPreparo(modosPreparo.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-bold hover:bg-red-50 rounded">×</button>
                  </div>
                ))}
                {modosPreparo.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum passo adicionado.</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button disabled={loading} type="submit" className="w-full bg-[#b78b03] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#a17802] disabled:opacity-50 transition-colors">
              {loading ? 'Salvando...' : 'Salvar Receita'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Lista
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Gerenciar Receitas</h3>
        <button onClick={() => setViewState('form')} className="bg-[#b78b03] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#a17802] shadow">
          + Nova Receita
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Tempo de Preparo</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receitas.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-800">{rec.nome}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs border border-amber-100">
                      {rec.categoria?.nome || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{rec.tempoPreparo || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(rec)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:underline">Inativar</button>
                  </td>
                </tr>
              ))}
              {receitas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhuma receita encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <AdminCategoryManager title="Categorias de Receitas" endpoint="/receitas/categorias" />
    </div>
  );
}

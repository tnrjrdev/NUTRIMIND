import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../../services/api';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  createdAt: string;
};

const initialForm = {
  nome: '',
  email: '',
  senha: '',
  ativo: true,
};

export function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    const response = await api.get('/usuarios');
    setUsuarios(response.data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchUsuarios();
    };

    void load();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData(initialForm);
    setError('');
    setViewState('list');
  };

  const handleEdit = async (usuario: Usuario) => {
    const response = await api.get(`/usuarios/${usuario.id}`);
    setEditId(usuario.id);
    setFormData({
      nome: response.data.nome,
      email: response.data.email,
      senha: '',
      ativo: response.data.ativo,
    });
    setError('');
    setViewState('form');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja inativar este usuário?')) return;

    try {
      await api.delete(`/usuarios/${id}`);
      await fetchUsuarios();
    } catch {
      setError('Não foi possível inativar o usuário.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editId) {
        await api.put(`/usuarios/${editId}`, formData);
      } else {
        await api.post('/usuarios', formData);
      }

      resetForm();
      await fetchUsuarios();
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message || 'Erro ao salvar usuário.');
      } else {
        setError('Erro ao salvar usuário.');
      }
      setLoading(false);
    }
  };

  if (viewState === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-slate-800">{editId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <button onClick={resetForm} className="rounded border px-4 py-2 text-sm">Voltar</button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Nome</label>
              <input
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded border p-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
              {editId ? 'Nova senha (opcional)' : 'Senha'}
            </label>
            <input
              type="password"
              required={!editId}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              className="w-full rounded border p-2"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            />
            Usuário ativo
          </label>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded bg-[#b78b03] py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Salvando...' : editId ? 'Salvar Usuário' : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-800">Usuários</h3>
        <button
          onClick={() => setViewState('form')}
          className="rounded bg-[#b78b03] px-5 py-2 text-sm font-medium text-white shadow"
        >
          + Novo Usuário
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Criado em</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 font-medium text-slate-800">{usuario.nome}</td>
                <td className="px-6 py-4 text-slate-600">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${usuario.ativo ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(usuario)} className="mr-3 text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(usuario.id)} className="text-red-500 hover:underline">Inativar</button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

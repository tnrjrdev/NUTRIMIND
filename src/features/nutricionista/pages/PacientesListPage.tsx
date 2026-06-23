import { useEffect, useState } from 'react';
import { ArrowLeft, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NutricionistaService } from '../services/nutricionista.service';
import type { PacienteResumo } from '../services/nutricionista.service';

export function PacientesListPage() {
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await NutricionistaService.getMeusPacientes();
        setPacientes(data);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        setError('Não foi possível carregar a lista de pacientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header Simplificado */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/nutri/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Meus Pacientes</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Barra de Pesquisa */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>

        {/* Lista de Pacientes */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum paciente encontrado</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Tente buscar com outros termos.' : 'Você ainda não tem pacientes vinculados.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {filteredPacientes.map((paciente) => (
                <li key={paciente.id} className="hover:bg-gray-50 transition-colors">
                  <Link to={`/pacientes/${paciente.id}/historico`} className="block px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {paciente.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{paciente.nome}</p>
                          <p className="text-sm text-gray-500">{paciente.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paciente.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {paciente.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Desde {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

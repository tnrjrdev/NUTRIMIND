import { Link } from 'react-router-dom';
import { Leaf, Users, Calendar, Activity } from 'lucide-react';
import { HomeHeader } from '../../feature/home/components/HomeHeader';
import { getStoredUser } from '../../auth/utils/session';

export function NutricionistaDashboardPage() {
  const authUser = getStoredUser();

  const userProfile = {
    name: authUser?.nome || 'Nutricionista',
    greeting: 'Consultório Ativo',
    avatarUrl: ''
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <HomeHeader user={userProfile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard do Nutricionista</h1>
          <p className="text-gray-600">Bem-vindo(a)! Aqui está o resumo do seu consultório.</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pacientes Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Consultas Hoje</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Planos Pendentes</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/nutri/pacientes"
            className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-500 transition-colors"
          >
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Meus Pacientes</h3>
              <p className="text-sm text-gray-500">Visualize e gerencie seus pacientes</p>
            </div>
          </Link>
          
          {/* Futuras ações: Criar Dieta, Agenda, etc. */}
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed">
            <div className="p-3 bg-gray-200 rounded-lg text-gray-500 mr-4">
              <Leaf size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Criar Plano Alimentar</h3>
              <p className="text-sm text-gray-500">Em breve...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

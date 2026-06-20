import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postagensService, type PostagemAlimentar, type FeedFilters } from '../../../services/postagensService';
import { AppShell } from '../../layout/components/AppShell';
import { LikeButton } from '../components/LikeButton';
import { CommentThread } from '../components/CommentThread';

export function HistoricoPacientePage() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [refeicoes, setRefeicoes] = useState<PostagemAlimentar[]>([]);
  const [filters, setFilters] = useState<FeedFilters>({ pacienteId: Number(pacienteId) });
  
  const loadRefeicoes = async () => {
    try {
      const data = await postagensService.getPostagens(filters);
      setRefeicoes(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    loadRefeicoes();
  }, [filters]);

  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto pb-24">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Histórico do Paciente</h1>
        
        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição</label>
            <select 
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500"
              value={filters.tipo || ''}
              onChange={e => setFilters({ ...filters, tipo: e.target.value })}
            >
              <option value="">Todas</option>
              <option value="CAFE_DA_MANHA">Café da Manhã</option>
              <option value="ALMOCO">Almoço</option>
              <option value="JANTAR">Jantar</option>
              <option value="LANCHE">Lanche</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input 
              type="datetime-local" 
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500"
              value={filters.dataIni || ''}
              onChange={e => setFilters({ ...filters, dataIni: e.target.value })}
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input 
              type="datetime-local" 
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500"
              value={filters.dataFim || ''}
              onChange={e => setFilters({ ...filters, dataFim: e.target.value })}
            />
          </div>
          
          <button 
            onClick={() => setFilters({ pacienteId: Number(pacienteId) })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Limpar
          </button>
        </div>

        <div className="space-y-8">
          {refeicoes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">Nenhuma refeição encontrada para estes filtros.</p>
            </div>
          ) : (
            refeicoes.map((refeicao) => (
              <div key={refeicao.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {refeicao.tipoRefeicao.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(refeicao.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
                
                {refeicao.imageUrl && (
                  <img src={refeicao.imageUrl} alt="Refeição" className="w-full h-80 object-cover" />
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <LikeButton 
                      postagemId={refeicao.id} 
                      initialCurtido={refeicao.curtido} 
                      initialTotal={refeicao.totalCurtidas || 0} 
                    />
                  </div>
                  
                  {refeicao.legenda && (
                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-semibold mr-2">{refeicao.usuario?.nome || 'Paciente'}</span>
                      {refeicao.legenda}
                    </p>
                  )}

                  <CommentThread postagemId={refeicao.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

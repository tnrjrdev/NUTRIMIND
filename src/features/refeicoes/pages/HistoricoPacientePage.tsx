import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postagensService, type PostagemAlimentar, type FeedFilters, type TipoRefeicao } from '../../../services/postagensService';
import { AppShell } from '../../layout/components/AppShell';
import { PostDetailModal } from '../components/PostDetailModal';
import { api } from '../../../services/api';

const TIPO_LABELS: Record<TipoRefeicao, string> = {
  CAFE_DA_MANHA: 'Café da manhã',
  ALMOCO: 'Almoço',
  JANTAR: 'Jantar',
  LANCHE: 'Lanche',
  OUTRO: 'Outro',
};

export function HistoricoPacientePage() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [refeicoes, setRefeicoes] = useState<PostagemAlimentar[]>([]);
  const [filters, setFilters] = useState<FeedFilters>({ pacienteId: Number(pacienteId) });
  const [pacienteNome, setPacienteNome] = useState('Carregando...');
  
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(true);
  const [totalRefeicoes, setTotalRefeicoes] = useState(0);

  const [selectedPost, setSelectedPost] = useState<PostagemAlimentar | null>(null);
  
  const loadRefeicoes = async (isLoadMore = false) => {
    try {
      const nextPage = isLoadMore ? page + 1 : 0;
      const data: any = await postagensService.getPostagens(filters, nextPage);
      
      const content = Array.isArray(data) ? data : (data?.content || []);
      
      if (isLoadMore) {
        setRefeicoes([...refeicoes, ...content]);
      } else {
        setRefeicoes(content);
        if (data && data.totalElements !== undefined) {
          setTotalRefeicoes(data.totalElements);
        } else {
          setTotalRefeicoes(content.length);
        }
      }
      
      setPage(nextPage);
      setLastPage(data?.last ?? true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const loadPaciente = async () => {
    try {
      const { data } = await api.get(`/usuarios/${pacienteId}`);
      if (data && data.nome) {
        setPacienteNome(data.nome);
      }
    } catch (e) {
      setPacienteNome('Paciente');
    }
  }

  useEffect(() => {
    loadPaciente();
  }, [pacienteId]);

  useEffect(() => {
    loadRefeicoes();
  }, [filters]);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto pb-24 bg-white min-h-screen">
        
        {/* Profile Header */}
        <div className="px-4 py-6 border-b border-gray-100 flex items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
            {pacienteNome[0]?.toUpperCase() || 'P'}
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-4">{pacienteNome}</h1>
            
            <div className="flex justify-between items-center max-w-xs">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">{totalRefeicoes}</span>
                <span className="text-xs text-gray-500">Refeições</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">72kg</span>
                <span className="text-xs text-gray-500">Peso</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900">68kg</span>
                <span className="text-xs text-gray-500">Meta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs (Fake for aesthetics) */}
        <div className="flex border-b border-gray-100">
          <div className="flex-1 flex justify-center py-3 border-t-2 border-green-900">
            <svg className="w-6 h-6 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-1 mt-1">
          {refeicoes.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Nenhuma foto encontrada.</p>
            </div>
          ) : (
            refeicoes.map((refeicao) => (
              <div 
                key={refeicao.id} 
                className="aspect-square bg-gray-100 cursor-pointer relative group"
                onClick={() => setSelectedPost(refeicao)}
              >
                <img 
                  src={refeicao.imagemUrl} 
                  alt="Post" 
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Indisponível' }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-semibold">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {refeicao.totalCurtidas || 0}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!lastPage && (
          <div className="text-center pt-8 pb-4">
            <button 
              onClick={() => loadRefeicoes(true)}
              className="bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors text-sm border border-gray-200"
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal 
          postagem={selectedPost} 
          tipoLabels={TIPO_LABELS} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </AppShell>
  );
}

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { PostagemAlimentar, TipoRefeicao } from '../../../services/postagensService';
import { PublicScaffold } from '../../content/components/PublicScaffold';
import { postagensService } from '../../../services/postagensService';
import { getStoredUser } from '../../auth/utils/session';
import { PostCard } from '../components/PostCard';
import { NovaRefeicaoModal } from '../components/NovaRefeicaoModal';
import { PostDetailModal } from '../components/PostDetailModal';

const TIPO_LABELS: Record<TipoRefeicao, string> = {
  CAFE_DA_MANHA: 'Café da manhã',
  ALMOCO: 'Almoço',
  JANTAR: 'Jantar',
  LANCHE: 'Lanche',
  OUTRO: 'Outro',
};

export function RefeicoesPage() {
  const [refeicoes, setRefeicoes] = useState<PostagemAlimentar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostagemAlimentar | null>(null);

  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(true);

  const user = getStoredUser();
  const isNutricionista = user?.papel === 'NUTRICIONISTA';

  useEffect(() => {
    loadRefeicoes();
  }, []);

  const loadRefeicoes = async (isLoadMore = false) => {
    try {
      const nextPage = isLoadMore ? page + 1 : 0;
      const data = await postagensService.getPostagens(undefined, nextPage);
      
      const content = Array.isArray(data) ? data : (data?.content || []);
      
      if (isLoadMore) {
        setRefeicoes([...refeicoes, ...content]);
      } else {
        setRefeicoes(content);
      }
      
      setPage(nextPage);
      setLastPage(data?.last ?? true);
    } catch (error) {
      toast.error('Erro ao carregar o feed de refeições');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (novaRefeicao: PostagemAlimentar) => {
    setRefeicoes([novaRefeicao, ...refeicoes]);
    setIsModalOpen(false);
  };

  return (
    <PublicScaffold
      title="Diário Alimentar"
      eyebrow={isNutricionista ? "Acompanhamento de Pacientes" : "Acompanhamento"}
      heroImage="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="max-w-xl mx-auto pb-24 bg-gray-50 min-h-screen">
        
        {/* Stories / Acesso Rápido - Placeholder */}
        <div className="bg-white px-4 py-4 mb-2 shadow-sm border-b border-gray-100 flex gap-4 overflow-x-auto hide-scrollbar">
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-[2px]">
              <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xl">🌟</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Você</span>
          </div>
          {/* Adicionar map de pacientes com posts recentes depois */}
        </div>

        {/* Botão de Nova Publicação (Paciente) */}
        {!isNutricionista && (
          <div className="px-4 py-3 bg-white mb-2 shadow-sm border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
              {user?.nome?.[0]?.toUpperCase() || 'U'}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 text-left bg-gray-100 text-gray-500 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Compartilhar nova refeição...
            </button>
          </div>
        )}

        {/* Feed de Refeições ou Histórico (Paciente) */}
        <div className="sm:py-4">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Carregando...</div>
          ) : refeicoes.length === 0 ? (
            <div className="text-center text-gray-500 bg-white p-8 sm:rounded-xl shadow-sm border-b sm:border border-gray-100 mx-0 sm:mx-4">
              Nenhuma refeição compartilhada ainda. Seja o primeiro!
            </div>
          ) : isNutricionista ? (
            // Visão do Nutricionista: Feed social vertical
            refeicoes.map((refeicao) => (
              <PostCard 
                key={refeicao.id} 
                postagem={refeicao} 
                tipoLabels={TIPO_LABELS} 
              />
            ))
          ) : (
            // Visão do Paciente: Histórico em Grid
            <div className="grid grid-cols-3 gap-1 mt-1 bg-white">
              <div className="col-span-3 px-4 py-2 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Meu Histórico</h3>
                <span className="text-sm text-gray-500">{refeicoes.length} {refeicoes.length === 1 ? 'publicação' : 'publicações'}</span>
              </div>
              {refeicoes.map((refeicao) => (
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
              ))}
            </div>
          )}
          
          {!lastPage && (
            <div className="text-center py-6">
              <button 
                onClick={() => loadRefeicoes(true)}
                className="bg-white shadow-sm border border-gray-200 text-gray-700 font-medium py-2 px-6 rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Carregar publicações antigas
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NovaRefeicaoModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handlePostCreated} 
          tipoLabels={TIPO_LABELS} 
        />
      )}

      {selectedPost && (
        <PostDetailModal 
          postagem={selectedPost} 
          tipoLabels={TIPO_LABELS} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </PublicScaffold>
  );
}

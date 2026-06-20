import React, { useState } from 'react';
import { LikeButton } from './LikeButton';
import { CommentThread } from './CommentThread';
import type { PostagemAlimentar, TipoRefeicao } from '../../../services/postagensService';
import { postagensService } from '../../../services/postagensService';

interface PostCardProps {
  postagem: PostagemAlimentar;
  tipoLabels: Record<TipoRefeicao, string>;
}

export function PostCard({ postagem, tipoLabels }: PostCardProps) {
  const [curtido, setCurtido] = useState(postagem.curtido);
  const [totalCurtidas, setTotalCurtidas] = useState(postagem.totalCurtidas || 0);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleDoubleTap = async () => {
    if (curtido) return; // Ja curtiu
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
    
    setCurtido(true);
    setTotalCurtidas(prev => prev + 1);
    try {
      await postagensService.curtirPostagem(postagem.id);
    } catch (error) {
      // Revert on fail
      setCurtido(false);
      setTotalCurtidas(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white shadow-sm border-b sm:border border-gray-200 sm:rounded-xl overflow-hidden mb-6">
      {/* Header do Post */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            {postagem.usuario?.nome?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span 
              className="font-semibold text-gray-900 text-sm cursor-pointer hover:underline"
              onClick={() => window.location.href = `/pacientes/${postagem.usuario?.id}/historico`}
            >
              {postagem.usuario?.nome || 'Usuário'}
            </span>
            {postagem.tipoRefeicao && (
              <span className="text-xs text-gray-500">
                {tipoLabels[postagem.tipoRefeicao]}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(postagem.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {/* Imagem Edge-to-Edge no Mobile */}
      <div className="relative w-full bg-gray-100" onDoubleClick={handleDoubleTap}>
        <img 
          src={postagem.imagemUrl} 
          alt="Refeição" 
          className="w-full aspect-square object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Imagem+Indisponível' }}
        />
        {/* Animacao de coracao no double tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-75">
            <svg className="w-24 h-24 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Acoes e Legenda */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <LikeButton 
            postagemId={postagem.id} 
            initialCurtido={curtido} 
            initialTotal={totalCurtidas} 
          />
        </div>
        
        {/* Nível de Fome e Emoção */}
        {(postagem.nivelFome || postagem.emocao) && (
          <div className="flex gap-2 mb-2">
            {postagem.emocao && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{postagem.emocao}</span>}
            {postagem.nivelFome && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Fome: {postagem.nivelFome}/10</span>}
          </div>
        )}

        {postagem.legenda && (
          <p className="text-gray-900 text-sm mb-2 leading-relaxed">
            <span 
              className="font-semibold mr-2 cursor-pointer hover:underline"
              onClick={() => window.location.href = `/pacientes/${postagem.usuario?.id}/historico`}
            >
              {postagem.usuario?.nome || 'Usuário'}
            </span>
            {postagem.legenda}
          </p>
        )}

        <CommentThread postagemId={postagem.id} />
      </div>
    </div>
  );
}

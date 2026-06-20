import React, { useState } from 'react';
import { postagensService } from '../../../services/postagensService';
import { getStoredUser } from '../../auth/utils/session';
import toast from 'react-hot-toast';

interface LikeButtonProps {
  postagemId: number;
  initialCurtido: boolean;
  initialTotal: number;
}

export function LikeButton({ postagemId, initialCurtido, initialTotal }: LikeButtonProps) {
  const [curtido, setCurtido] = useState(initialCurtido);
  const [total, setTotal] = useState(initialTotal || 0);
  const [loading, setLoading] = useState(false);
  
  const user = getStoredUser();
  const canLike = user?.papel === 'NUTRICIONISTA';

  const handleToggle = async () => {
    if (loading || !canLike) return;
    setLoading(true);
    
    const novoCurtido = !curtido;
    setCurtido(novoCurtido);
    setTotal(novoCurtido ? total + 1 : total - 1);

    try {
      if (novoCurtido) {
        await postagensService.curtirPostagem(postagemId);
      } else {
        await postagensService.descurtirPostagem(postagemId);
      }
    } catch (error) {
      toast.error('Erro ao curtir a publicação');
      setCurtido(curtido);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading || !canLike}
      className={`flex items-center gap-2 focus:outline-none transition-transform ${canLike ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'} ${loading ? 'opacity-50' : ''}`}
    >
      {curtido ? (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="w-8 h-8 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
      <span className="text-sm font-medium text-gray-600">
        {total} {total === 1 ? 'curtida' : 'curtidas'}
      </span>
    </button>
  );
}

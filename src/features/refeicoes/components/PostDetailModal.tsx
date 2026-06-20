import React from 'react';
import type { PostagemAlimentar, TipoRefeicao } from '../../../services/postagensService';
import { PostCard } from './PostCard';

interface PostDetailModalProps {
  postagem: PostagemAlimentar;
  tipoLabels: Record<TipoRefeicao, string>;
  onClose: () => void;
}

export function PostDetailModal({ postagem, tipoLabels, onClose }: PostDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6">
      <div className="relative w-full max-w-xl max-h-full overflow-y-auto hide-scrollbar">
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/75 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-white sm:rounded-xl overflow-hidden">
          <PostCard postagem={postagem} tipoLabels={tipoLabels} />
        </div>
      </div>
    </div>
  );
}

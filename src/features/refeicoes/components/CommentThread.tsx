import React, { useState, useEffect } from 'react';
import { postagensService, type Comentario } from '../../../services/postagensService';
import toast from 'react-hot-toast';

interface CommentThreadProps {
  postagemId: number;
}

export function CommentThread({ postagemId }: CommentThreadProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoTexto, setNovoTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarComentarios();
  }, [postagemId]);

  const carregarComentarios = async () => {
    setLoading(true);
    try {
      const data = await postagensService.getComentarios(postagemId);
      setComentarios(data.content);
    } catch (error) {
      toast.error('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;

    setEnviando(true);
    try {
      const comentario = await postagensService.comentarPostagem(postagemId, novoTexto);
      setComentarios([...comentarios, comentario]);
      setNovoTexto('');
    } catch (error) {
      toast.error('Erro ao enviar comentário');
    } finally {
      setEnviando(false);
    }
  };

  const handleExcluir = async (id: number) => {
    try {
      await postagensService.excluirComentario(id);
      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Erro ao excluir comentário');
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {loading ? (
        <p className="text-sm text-gray-400">Carregando comentários...</p>
      ) : (
        <div className="space-y-3 mb-4">
          {comentarios.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhum comentário ainda.</p>
          ) : (
            comentarios.map(c => (
              <div key={c.id} className="flex flex-col bg-gray-50 p-2 rounded-lg text-sm group">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">{c.autor.nome}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleExcluir(c.id)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{c.texto}</p>
              </div>
            ))
          )}
        </div>
      )}

      <form onSubmit={handleComentar} className="flex gap-2">
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          disabled={!novoTexto.trim() || enviando}
          className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {enviando ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

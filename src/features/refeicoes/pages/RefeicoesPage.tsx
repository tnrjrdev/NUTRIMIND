import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RefeicaoEnviada, TipoRefeicao } from '../../../services/refeicoesService';
import { refeicoesService } from '../../../services/refeicoesService';

const TIPO_LABELS: Record<TipoRefeicao, string> = {
  CAFE_DA_MANHA: 'Café da manhã',
  ALMOCO: 'Almoço',
  JANTAR: 'Jantar',
  LANCHE: 'Lanche',
  OUTRO: 'Outro',
};

export function RefeicoesPage() {
  const [refeicoes, setRefeicoes] = useState<RefeicaoEnviada[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagemUrl, setImagemUrl] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoRefeicao, setTipoRefeicao] = useState<TipoRefeicao | ''>('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    loadRefeicoes();
  }, []);

  const loadRefeicoes = async () => {
    try {
      const data = await refeicoesService.getRefeicoes();
      setRefeicoes(data);
    } catch (error) {
      toast.error('Erro ao carregar o feed de refeições');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNomeArquivo(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagemUrl) {
      toast.error('A imagem é obrigatória');
      return;
    }

    setEnviando(true);
    try {
      const novaRefeicao = await refeicoesService.criarRefeicao({
        imagemUrl,
        descricao,
        ...(tipoRefeicao ? { tipoRefeicao } : {}),
      });
      setRefeicoes([novaRefeicao, ...refeicoes]);
      setImagemUrl('');
      setNomeArquivo('');
      setDescricao('');
      setTipoRefeicao('');
      toast.success('Refeição enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar refeição');
    } finally {
      setEnviando(false);
    }
  };

  const handleCurtir = async (id: number) => {
    try {
      // Optimistic update
      setRefeicoes(refeicoes.map(r => r.id === id ? { ...r, curtido: !r.curtido } : r));
      
      const atualizada = await refeicoesService.curtirRefeicao(id);
      
      // Update with server data
      setRefeicoes(refeicoes.map(r => r.id === id ? atualizada : r));
    } catch (error) {
      toast.error('Erro ao curtir a refeição');
      // Revert in case of error (load again or revert manually)
      loadRefeicoes();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Diário Alimentar</h1>
      
      {/* Formulário de Envio */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Compartilhar Refeição</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto da Refeição</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            {nomeArquivo && <p className="text-xs text-gray-500 mt-2">Arquivo selecionado: {nomeArquivo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="O que você comeu?"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de refeição (opcional)</label>
            <select
              value={tipoRefeicao}
              onChange={(e) => setTipoRefeicao(e.target.value as TipoRefeicao | '')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecione...</option>
              {(Object.keys(TIPO_LABELS) as TipoRefeicao[]).map((tipo) => (
                <option key={tipo} value={tipo}>{TIPO_LABELS[tipo]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={enviando || !imagemUrl}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {enviando ? 'Enviando...' : 'Compartilhar'}
          </button>
        </form>
      </div>

      {/* Feed de Refeições */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Carregando feed...</div>
        ) : refeicoes.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-sm">
            Nenhuma refeição compartilhada ainda. Seja o primeiro!
          </div>
        ) : (
          refeicoes.map((refeicao) => (
            <div key={refeicao.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="font-medium text-gray-800">
                  {refeicao.usuario?.nome || 'Usuário'}
                </div>
                <div className="flex items-center gap-2">
                  {refeicao.tipoRefeicao && (
                    <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      {TIPO_LABELS[refeicao.tipoRefeicao]}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(refeicao.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <img 
                src={refeicao.imagemUrl} 
                alt="Refeição" 
                className="w-full h-80 object-cover bg-gray-100"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Imagem+Indisponível' }}
              />
              
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <button 
                    onClick={() => handleCurtir(refeicao.id)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    {refeicao.curtido ? (
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                  <span className="ml-2 text-sm text-gray-600 font-medium">
                    {refeicao.curtido ? 'Nutricionista aprovou!' : 'Aguardando avaliação'}
                  </span>
                </div>
                
                {refeicao.descricao && (
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold mr-2">{refeicao.usuario?.nome || 'Usuário'}</span>
                    {refeicao.descricao}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

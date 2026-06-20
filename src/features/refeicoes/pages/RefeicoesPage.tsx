import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LikeButton } from '../components/LikeButton';
import { CommentThread } from '../components/CommentThread';
import type { PostagemAlimentar, TipoRefeicao } from '../../../services/postagensService';
import { PublicScaffold } from '../../content/components/PublicScaffold';
import {
  postagensService,
  TAMANHO_MAX_IMAGEM,
  TIPOS_IMAGEM_PERMITIDOS,
} from '../../../services/postagensService';

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
  const [imagemUrl, setImagemUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [legenda, setLegenda] = useState('');
  const [tipoRefeicao, setTipoRefeicao] = useState<TipoRefeicao | ''>('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    loadRefeicoes();
  }, []);

  const loadRefeicoes = async () => {
    try {
      const data = await postagensService.getPostagens();
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
      setFileToUpload(file);
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
    if (!fileToUpload) {
      toast.error('A imagem é obrigatória');
      return;
    }

    setEnviando(true);
    try {
      const { imagemKey } = await postagensService.uploadImagem(fileToUpload);

      const novaRefeicao = await postagensService.criarPostagem({
        imagemKey,
        legenda: legenda,
        ...(tipoRefeicao ? { tipoRefeicao } : {}),
      });
      setRefeicoes([novaRefeicao, ...refeicoes]);
      setImagemUrl('');
      setFileToUpload(null);
      setNomeArquivo('');
      setLegenda('');
      setTipoRefeicao('');
      toast.success('Refeição enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar refeição');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PublicScaffold
      title="Diário Alimentar"
      eyebrow="Acompanhamento"
      heroImage="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="p-6 mx-auto pb-24">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
              <textarea
                value={legenda}
                onChange={(e) => setLegenda(e.target.value)}
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
              disabled={enviando || !fileToUpload}
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
                  <div className="flex items-center justify-between mb-3">
                    <LikeButton 
                      postagemId={refeicao.id} 
                      initialCurtido={refeicao.curtido} 
                      initialTotal={refeicao.totalCurtidas || 0} 
                    />
                  </div>
                  
                  {refeicao.legenda && (
                    <p className="text-gray-700 text-sm mb-2">
                      <span 
                        className="font-semibold mr-2 cursor-pointer hover:underline text-green-700"
                        onClick={() => window.location.href = `/pacientes/${refeicao.usuario?.id}/historico`}
                      >
                        {refeicao.usuario?.nome || 'Usuário'}
                      </span>
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
    </PublicScaffold>
  );
}

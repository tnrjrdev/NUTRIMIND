import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { postagensService, type TipoRefeicao } from '../../../services/postagensService';

interface NovaRefeicaoModalProps {
  onClose: () => void;
  onSuccess: (novaRefeicao: any) => void;
  tipoLabels: Record<TipoRefeicao, string>;
}

export function NovaRefeicaoModal({ onClose, onSuccess, tipoLabels }: NovaRefeicaoModalProps) {
  const [step, setStep] = useState(1);
  const [imagemUrl, setImagemUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [legenda, setLegenda] = useState('');
  const [tipoRefeicao, setTipoRefeicao] = useState<TipoRefeicao | ''>('');
  const [nivelFome, setNivelFome] = useState(5);
  const [emocao, setEmocao] = useState('');
  const [nutricionistaId, setNutricionistaId] = useState<number | ''>('');
  const [nutricionistas, setNutricionistas] = useState<{id: number, nome: string}[]>([]);
  const [enviando, setEnviando] = useState(false);

  const EMOCOES = ['😊 Feliz', '😔 Triste', '😟 Ansioso(a)', '😌 Tranquilo(a)', '😴 Cansado(a)', '😠 Irritado(a)'];

  React.useEffect(() => {
    postagensService.getNutricionistas().then(setNutricionistas).catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUrl(reader.result as string);
        setStep(2); // Vai para a etapa 2 (Detalhes) após selecionar a foto
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!fileToUpload) return;
    setEnviando(true);
    try {
      const { imagemKey } = await postagensService.uploadImagem(fileToUpload);
      const novaRefeicao = await postagensService.criarPostagem({
        imagemKey,
        legenda,
        ...(tipoRefeicao ? { tipoRefeicao } : {}),
        nivelFome,
        ...(emocao ? { emocao } : {}),
        ...(nutricionistaId ? { nutricionistaId: Number(nutricionistaId) } : {}),
      });
      toast.success('Refeição enviada com sucesso!');
      onSuccess(novaRefeicao);
    } catch (error) {
      toast.error('Erro ao enviar refeição');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-medium">
            Cancelar
          </button>
          <h2 className="font-semibold text-gray-900">Nova Publicação</h2>
          {step === 2 ? (
            <button 
              onClick={handleSubmit} 
              disabled={enviando}
              className="text-green-600 font-semibold disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Publicar'}
            </button>
          ) : <div className="w-16" />}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-1">
          {step === 1 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <label className="bg-green-600 text-white px-6 py-3 rounded-full font-medium cursor-pointer hover:bg-green-700 transition-colors">
                Escolher Foto
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 pb-4">
              <div className="flex gap-4">
                <img src={imagemUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <textarea
                  value={legenda}
                  onChange={(e) => setLegenda(e.target.value)}
                  placeholder="Escreva uma legenda..."
                  className="flex-1 w-full outline-none resize-none text-gray-800"
                  rows={3}
                />
              </div>
              
              <hr className="border-gray-100" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nutricionista (opcional)</label>
                <select
                  value={nutricionistaId}
                  onChange={(e) => setNutricionistaId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 outline-none bg-white text-gray-700"
                >
                  <option value="">Selecione um nutricionista...</option>
                  {nutricionistas.map((nutri) => (
                    <option key={nutri.id} value={nutri.id}>{nutri.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de refeição</label>
                <select
                  value={tipoRefeicao}
                  onChange={(e) => setTipoRefeicao(e.target.value as TipoRefeicao | '')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 outline-none bg-white text-gray-700"
                >
                  <option value="">Selecione...</option>
                  {(Object.keys(tipoLabels) as TipoRefeicao[]).map((tipo) => (
                    <option key={tipo} value={tipo}>{tipoLabels[tipo]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como você está se sentindo?
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOCOES.map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setEmocao(emo)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        emocao === emo 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Nível de Fome</label>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">{nivelFome}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={nivelFome}
                  onChange={(e) => setNivelFome(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Sem fome</span>
                  <span>Faminto</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

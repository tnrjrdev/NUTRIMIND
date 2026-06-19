import { api } from './api';

export interface RefeicaoEnviada {
  id: number;
  descricao: string;
  imagemUrl: string;
  curtido: boolean;
  createdAt: string;
  usuario: {
    id: number;
    nome: string;
  };
}

export const refeicoesService = {
  getRefeicoes: async () => {
    const response = await api.get<RefeicaoEnviada[]>('/refeicoes');
    return response.data;
  },

  criarRefeicao: async (data: { descricao?: string; imagemUrl: string }) => {
    const response = await api.post<RefeicaoEnviada>('/refeicoes', data);
    return response.data;
  },

  curtirRefeicao: async (id: number) => {
    const response = await api.patch<RefeicaoEnviada>(`/refeicoes/${id}/curtir`);
    return response.data;
  },
};

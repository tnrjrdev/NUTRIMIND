import { api } from './api';

export type TipoRefeicao = 'CAFE_DA_MANHA' | 'ALMOCO' | 'JANTAR' | 'LANCHE' | 'OUTRO';

export interface RefeicaoEnviada {
  id: number;
  descricao: string;
  imagemUrl: string;
  tipoRefeicao?: TipoRefeicao | null;
  capturadaEm?: string | null;
  curtido: boolean;
  createdAt: string;
  usuario: {
    id: number;
    nome: string;
  };
}

export interface CriarRefeicaoInput {
  imagemUrl: string;
  descricao?: string;
  tipoRefeicao?: TipoRefeicao;
  capturadaEm?: string;
}

export const refeicoesService = {
  // Feed ja vem filtrado por papel/vinculo no backend (paciente ve as proprias;
  // nutricionista ve as dos seus pacientes). pacienteId e opcional (nutri/admin).
  getRefeicoes: async (pacienteId?: number) => {
    const response = await api.get<RefeicaoEnviada[]>('/refeicoes', {
      params: pacienteId ? { pacienteId } : undefined,
    });
    return response.data;
  },

  criarRefeicao: async (data: CriarRefeicaoInput) => {
    const response = await api.post<RefeicaoEnviada>('/refeicoes', data);
    return response.data;
  },

  curtirRefeicao: async (id: number) => {
    const response = await api.patch<RefeicaoEnviada>(`/refeicoes/${id}/curtir`);
    return response.data;
  },
};

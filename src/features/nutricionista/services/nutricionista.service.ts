import { api } from '../../../services/api';

export interface PacienteResumo {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  createdAt: string;
}

export const NutricionistaService = {
  getMeusPacientes: async (): Promise<PacienteResumo[]> => {
    const response = await api.get('/nutricionistas/me/pacientes');
    return response.data;
  },
};

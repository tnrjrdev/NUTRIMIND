import { api } from './api';

export interface Notificacao {
  id: number;
  mensagem: string;
  lida: boolean;
  linkDestino: string;
  createdAt: string;
}

export const notificacoesService = {
  getNotificacoes: async (page: number = 0) => {
    const response = await api.get<{ content: Notificacao[], totalPages: number }>('/notificacoes', {
      params: { page, size: 20 }
    });
    return response.data;
  },

  getCountNaoLidas: async () => {
    const response = await api.get<{ count: number }>('/notificacoes/nao-lidas');
    return response.data.count;
  },

  marcarComoLida: async (id: number) => {
    await api.post(`/notificacoes/${id}/lida`);
  },

  marcarTodasComoLidas: async () => {
    await api.post('/notificacoes/ler-todas');
  }
};

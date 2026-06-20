import { api } from './api';

export type TipoRefeicao = 'CAFE_DA_MANHA' | 'ALMOCO' | 'JANTAR' | 'LANCHE' | 'OUTRO';

export interface PostagemAlimentar {
  id: number;
  legenda: string;
  imagemUrl: string; // URL assinada
  tipoRefeicao: TipoRefeicao;
  capturadaEm: string;
  nivelFome?: number;
  emocao?: string;
  curtido: boolean;
  totalCurtidas: number;
  createdAt: string;
  usuario: {
    id: number;
    nome: string;
  };
}

export interface Comentario {
  id: number;
  texto: string;
  createdAt: string;
  autor: {
    id: number;
    nome: string;
  };
}

export interface CriarPostagemInput {
  imagemKey: string;
  legenda?: string;
  tipoRefeicao?: TipoRefeicao;
  capturadaEm?: string;
  nivelFome?: number;
  emocao?: string;
  nutricionistaId?: number;
}

export const TIPOS_IMAGEM_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
export const TAMANHO_MAX_IMAGEM = 8 * 1024 * 1024; // 8MB

export interface FeedFilters {
  pacienteId?: number;
  tipo?: string;
  dataIni?: string; // ISO string
  dataFim?: string; // ISO string
}

export const postagensService = {
  getPostagens: async (filters?: FeedFilters, page: number = 0, size: number = 20) => {
    const response = await api.get<{ content: PostagemAlimentar[], totalPages: number, last: boolean }>('/postagens', {
      params: { ...filters, page, size },
    });
    return response.data;
  },

  getPostagem: async (id: number) => {
    const response = await api.get<PostagemAlimentar>(`/postagens/${id}`);
    return response.data;
  },

  getNutricionistas: async () => {
    const response = await api.get<{id: number, nome: string}[]>('/usuarios/nutricionistas');
    return response.data;
  },

  uploadImagem: async (file: File) => {
    const { data } = await api.post<{ uploadUrl: string; imagemKey: string }>('/postagens/upload-url', {
      contentType: file.type,
      tamanhoBytes: file.size
    });

    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Falha no upload da imagem');
    }

    return { imagemKey: data.imagemKey };
  },

  criarPostagem: async (data: CriarPostagemInput) => {
    const response = await api.post<PostagemAlimentar>('/postagens', data);
    return response.data;
  },

  excluirPostagem: async (id: number) => {
    await api.delete(`/postagens/${id}`);
  },

  curtirPostagem: async (id: number) => {
    await api.post(`/postagens/${id}/curtidas`);
  },

  descurtirPostagem: async (id: number) => {
    await api.delete(`/postagens/${id}/curtidas`);
  },

  comentarPostagem: async (id: number, texto: string) => {
    const response = await api.post<Comentario>(`/postagens/${id}/comentarios`, { texto });
    return response.data;
  },

  getComentarios: async (id: number, page: number = 0) => {
    const response = await api.get<{ content: Comentario[], totalPages: number }>(`/postagens/${id}/comentarios`, {
      params: { page, size: 10 }
    });
    return response.data;
  },

  excluirComentario: async (id: number) => {
    await api.delete(`/comentarios/${id}`);
  }
};

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Restaurante = {
  id: number;
  nome: string;
  descricao?: string;
  telefone?: string;
  linkExterno?: string;
  categoria?: { nome: string };
};

export function IfoodDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Restaurante | null>(null);

  useEffect(() => {
    api.get(`/ifood/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Restaurante"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando restaurante..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title={item.nome} eyebrow={item.categoria?.nome || 'iFood'} heroImage="https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=1400&q=80">
      <div className="space-y-5">
        <InfoBlock title="Descrição">
          <p>{item.descricao || 'Sem descrição cadastrada.'}</p>
        </InfoBlock>
        <InfoBlock title="Contato">
          <p>Telefone: {item.telefone || 'Não informado'}</p>
          <p>Link externo: {item.linkExterno || 'Não informado'}</p>
        </InfoBlock>
      </div>
    </PublicScaffold>
  );
}

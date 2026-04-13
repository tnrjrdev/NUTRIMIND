import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Item = {
  id: number;
  nome: string;
  descricao?: string;
  equivalencia?: string;
  categoria?: { nome: string };
};

export function SubstituicaoDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    api.get(`/substituicoes/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Substituição"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando item..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title={item.nome} eyebrow={item.categoria?.nome || 'Substituição'} heroImage="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80">
      <div className="space-y-5">
        <InfoBlock title="Descrição">
          <p>{item.descricao || 'Sem descrição cadastrada.'}</p>
        </InfoBlock>
        <InfoBlock title="Equivalência">
          <p>{item.equivalencia || 'Sem equivalência cadastrada.'}</p>
        </InfoBlock>
      </div>
    </PublicScaffold>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Item = {
  id: number;
  nome: string;
  descricaoCurta?: string;
  descricaoDetalhada?: string;
  instagram?: string;
  site?: string;
  midiaUrl?: string;
};

export function BemEstarDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    api.get(`/bem-estar/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Bem-Estar"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando item..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title={item.nome} eyebrow="Bem-Estar" heroImage={item.midiaUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80'}>
      <div className="space-y-5">
        <InfoBlock title="Resumo">
          <p>{item.descricaoCurta || 'Sem resumo cadastrado.'}</p>
          {item.descricaoDetalhada && <p>{item.descricaoDetalhada}</p>}
        </InfoBlock>
        <InfoBlock title="Links">
          <p>Instagram: {item.instagram || 'Não informado'}</p>
          <p>Site: {item.site || 'Não informado'}</p>
        </InfoBlock>
      </div>
    </PublicScaffold>
  );
}

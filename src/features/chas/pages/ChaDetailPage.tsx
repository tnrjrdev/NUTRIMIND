import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Cha = {
  id: number;
  nome: string;
  formaUtilizacao?: string;
  posologia?: string;
  contraindicacoes?: string;
  observacoes?: string;
  categoria?: { nome: string };
};

export function ChaDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Cha | null>(null);

  useEffect(() => {
    api.get(`/chas/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Chá"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando chá..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title={item.nome} eyebrow={item.categoria?.nome || 'Chá'} heroImage="https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1400&q=80">
      <div className="space-y-5">
        <InfoBlock title="Forma de utilizar">
          <p>{item.formaUtilizacao || 'Não informada.'}</p>
        </InfoBlock>
        <InfoBlock title="Posologia">
          <p>{item.posologia || 'Não informada.'}</p>
        </InfoBlock>
        <InfoBlock title="Contraindicações">
          <p>{item.contraindicacoes || 'Não informadas.'}</p>
        </InfoBlock>
        <InfoBlock title="Observações">
          <p>{item.observacoes || 'Nenhuma observação cadastrada.'}</p>
        </InfoBlock>
      </div>
    </PublicScaffold>
  );
}

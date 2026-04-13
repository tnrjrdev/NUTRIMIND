import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Dica = {
  id: number;
  texto: string;
};

export function DicaDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Dica | null>(null);

  useEffect(() => {
    api.get(`/dicas/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Dica"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando dica..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title="Dica" eyebrow="Orientação" heroImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80">
      <InfoBlock title="Conteúdo">
        <p className="text-lg leading-8 text-slate-700">{item.texto}</p>
      </InfoBlock>
    </PublicScaffold>
  );
}

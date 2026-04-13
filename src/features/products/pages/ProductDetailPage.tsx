import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { InfoBlock, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Produto = {
  id: number;
  nome: string;
  marca?: string;
  descricao?: string;
  imagem?: string;
  categoria?: { nome: string };
};

export function ProductDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Produto | null>(null);

  useEffect(() => {
    api.get(`/produtos/${id}`).then((res) => setItem(res.data));
  }, [id]);

  if (!item) {
    return (
      <PublicScaffold
        title="Produto"
        eyebrow="Detalhe"
        heroImage="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80"
      >
        <PublicLoadingState message="Carregando produto..." />
      </PublicScaffold>
    );
  }

  return (
    <PublicScaffold title={item.nome} eyebrow={item.categoria?.nome || 'Produto'} heroImage={item.imagem || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80'}>
      <div className="space-y-5">
        {item.imagem && <img src={item.imagem} alt={item.nome} className="max-h-80 w-full rounded-[28px] object-contain bg-slate-50 p-5" />}
        <InfoBlock title="Marca">
          <p>{item.marca || 'Não informada'}</p>
        </InfoBlock>
        <InfoBlock title="Descrição">
          <p>{item.descricao || 'Sem descrição cadastrada.'}</p>
        </InfoBlock>
      </div>
    </PublicScaffold>
  );
}

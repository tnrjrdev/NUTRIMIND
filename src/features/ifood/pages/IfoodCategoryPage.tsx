import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Restaurante = {
  id: number;
  nome: string;
  descricao?: string;
  telefone?: string;
};

export function IfoodCategoryPage() {
  const navigate = useNavigate();
  const { categoriaId } = useParams();
  const [items, setItems] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ifood?categoriaId=${categoriaId}`).then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, [categoriaId]);

  return (
    <PublicScaffold
      title="Restaurantes da Categoria"
      eyebrow="iFood"
      heroImage="https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=1400&q=80"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <PublicLoadingState message="Carregando restaurantes..." />
        ) : items.length === 0 ? (
          <PublicEmptyState message="Nenhum restaurante encontrado nesta categoria." />
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/ifood/${item.id}`)}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-800">{item.nome}</h2>
              {item.descricao && <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>}
              {item.telefone && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a77f14]">{item.telefone}</p>}
            </button>
          ))
        )}
      </div>
    </PublicScaffold>
  );
}

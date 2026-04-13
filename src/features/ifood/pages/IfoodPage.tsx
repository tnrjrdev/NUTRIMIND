import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { PublicEmptyState, PublicLoadingState, PublicScaffold } from '../../content/components/PublicScaffold';

type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
};

export function IfoodPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ifood/categorias').then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <PublicScaffold
      title="Sugestões iFood"
      eyebrow="Delivery"
      heroImage="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1400&q=80"
      backTo="/home"
    >
      <div className="space-y-3">
        {loading ? (
          <PublicLoadingState message="Carregando categorias..." />
        ) : categories.length === 0 ? (
          <PublicEmptyState message="Nenhuma sugestão cadastrada." />
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`/ifood/categoria/${category.id}`)}
              className="flex w-full items-center justify-between rounded-[22px] border border-transparent bg-[#f7eed5] px-5 py-5 text-left text-sm font-semibold text-[#3f3b34] shadow-[0_10px_30px_rgba(145,101,21,0.08)] transition hover:bg-[#f2e6c5]"
            >
              <span>
                <span className="block text-base">{category.nome}</span>
                {category.descricao && <span className="mt-1 block text-xs text-slate-500">{category.descricao}</span>}
              </span>
              <span className="text-lg font-semibold text-[#8d6b18]">›</span>
            </button>
          ))
        )}
      </div>
    </PublicScaffold>
  );
}

import type { Product } from "../types/products.types";

type ProductCardProps = {
  product: Product;
};

function getIcon(icon: string) {
  switch (icon) {
    case "pill":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M12 2v20M7 7h10M7 12h10M7 17h10" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "protein":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M8 15c1-3 3-4 4-5 1 1 3 2 4 5" stroke="#3b4a76" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 9c2-2 5-2 7 0 2 2 2 5 0 7" stroke="#3b4a76" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "vitamin":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#2e6f3f" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "tea":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M7 6h10v7a5 5 0 01-10 0V6z" stroke="#3b4a76" strokeWidth="1.8" />
          <path d="M17 8h2a2 2 0 010 4h-2" stroke="#3b4a76" strokeWidth="1.8" />
        </svg>
      );
    case "oil":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M12 2v20M7 7h10M7 12h10M7 17h10" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M8 15c1-3 3-4 4-5 1 1 3 2 4 5" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 9c2-2 5-2 7 0 2 2 2 5 0 7" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#3b4a76" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="#3b4a76" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] bg-[#f9f7f1] px-6 py-7 text-left shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-[#f9f4e1] via-[#fff7ee] to-[#f5e9d5]" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/90 shadow-sm">
        {getIcon(product.category.toLowerCase().includes('suplementos') ? 'pill' :
                 product.category.toLowerCase().includes('proteína') ? 'protein' :
                 product.category.toLowerCase().includes('vitamina') ? 'vitamin' :
                 product.category.toLowerCase().includes('chá') ? 'tea' :
                 product.category.toLowerCase().includes('óleo') ? 'oil' : 'leaf')}
      </div>
      <div className="mt-6 min-h-[88px]">
        <h3 className="text-base font-semibold leading-7 text-[#20212c]">{product.name}</h3>
        <p className="mt-2 text-sm text-[#6b7280]">{product.description}</p>
        <p className="mt-3 text-lg font-bold text-[#8d6b18]">R$ {product.price.toFixed(2)}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
          product.inStock
            ? 'bg-[#e8f5e8] text-[#2e6f3f]'
            : 'bg-[#fee2e2] text-[#dc2626]'
        }`}>
          {product.inStock ? 'Em estoque' : 'Indisponível'}
        </span>
        <span className="text-xl font-semibold text-[#8d6b18] transition group-hover:translate-x-1">›</span>
      </div>
    </article>
  );
}
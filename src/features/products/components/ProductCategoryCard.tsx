import type { ProductCategory } from "../types/products.types";

type ProductCategoryCardProps = {
  category: ProductCategory;
};

function getIcon(icon: string) {
  switch (icon) {
    case "pill":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M12 2v20M7 7h10M7 12h10M7 17h10" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "protein":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M8 15c1-3 3-4 4-5 1 1 3 2 4 5" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 9c2-2 5-2 7 0 2 2 2 5 0 7" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "vitamin":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#8d6b18" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "tea":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M7 6h10v7a5 5 0 01-10 0V6z" stroke="#8d6b18" strokeWidth="1.8" />
          <path d="M17 8h2a2 2 0 010 4h-2" stroke="#8d6b18" strokeWidth="1.8" />
        </svg>
      );
    case "oil":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M12 2v20M7 7h10M7 12h10M7 17h10" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M8 15c1-3 3-4 4-5 1 1 3 2 4 5" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 9c2-2 5-2 7 0 2 2 2 5 0 7" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#8d6b18" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="#8d6b18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function ProductCategoryCard({ category }: ProductCategoryCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-[22px] border border-transparent bg-[#f7eed5] px-5 py-5 text-left text-sm font-semibold text-[#3f3b34] shadow-[0_10px_30px_rgba(145,101,21,0.08)] transition hover:bg-[#f2e6c5]"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9d9a5] text-emerald-800 shadow-sm">
          {getIcon(category.icon)}
        </span>
        <div>
          <span>{category.name}</span>
          <span className="ml-2 text-xs text-emerald-800 font-normal">
            ({category.productCount} produtos)
          </span>
        </div>
      </span>
      <span className="text-lg font-semibold text-emerald-800">›</span>
    </button>
  );
}
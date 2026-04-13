import type { FeaturedRecipe } from "../types/home.types";

type RecipeCardProps = {
  recipe: FeaturedRecipe;
};

function getIcon(icon: string) {
  switch (icon) {
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M8 15c1-3 3-4 4-5 1 1 3 2 4 5" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 9c2-2 5-2 7 0 2 2 2 5 0 7" stroke="#2e6f3f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "taco":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M4 12c2-3 8-5 16-2v3c-8 2-12 0-16-1z" stroke="#3b4a76" strokeWidth="1.8" fill="#f7dca8" />
          <path d="M8 12.5a2 2 0 01-2 2" stroke="#3b4a76" strokeWidth="1.8" />
          <path d="M14 12.5a2 2 0 01-2 2" stroke="#3b4a76" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#3b4a76" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="#3b4a76" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] bg-[#f9f7f1] px-6 py-7 text-left shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-[#f9f4e1] via-[#fff7ee] to-[#f5e9d5]" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/90 shadow-sm">
        {getIcon(recipe.icon)}
      </div>
      <div className="mt-6 min-h-[88px]">
        <h3 className="text-base font-semibold leading-7 text-[#20212c]">{recipe.title}</h3>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff2d8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6b18]">
          Ver mais
        </span>
        <span className="text-xl font-semibold text-[#8d6b18] transition group-hover:translate-x-1">›</span>
      </div>
    </article>
  );
}
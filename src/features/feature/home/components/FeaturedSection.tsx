import type { FeaturedRecipe } from "../types/home.types";
import { RecipeCard } from "./RecipeCard";

type FeaturedSectionProps = {
  recipes: FeaturedRecipe[];
};

export function FeaturedSection({ recipes }: FeaturedSectionProps) {
  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200 sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f3ead2] text-[#a37f21] shadow-sm">
            <span className="text-xl">🍃</span>
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9a7b1d]">Receitas em destaque</p>
            <p className="text-sm text-[#6f716f]">Descubra receitas selecionadas para você.</p>
          </div>
        </div>
        <span className="rounded-full bg-[#eef5ff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#3a5bb8]">
          4 cards
        </span>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
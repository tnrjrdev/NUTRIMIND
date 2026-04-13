import type { FeaturedRecipe } from "../types/home.types";

export async function getFeaturedRecipes(): Promise<FeaturedRecipe[]> {
  return [
    { id: "1", title: "ABACATE: (MOUSSE DE CACAU.)", icon: "leaf" },
    { id: "2", title: "ALMONDEGAS DE FRANGO", icon: "leaf" },
  ];
}
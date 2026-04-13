import { useEffect, useState } from "react";
import type { FeaturedRecipe } from "../types/home.types";
import { getFeaturedRecipes } from "../services/home.service";

export function useHome() {
  const [recipes, setRecipes] = useState<FeaturedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getFeaturedRecipes();
      setRecipes(data);
      setLoading(false);
    }

    loadData();
  }, []);

  return {
    recipes,
    loading,
  };
}
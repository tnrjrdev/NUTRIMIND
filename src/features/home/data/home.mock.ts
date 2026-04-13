import type {
  UserProfile,
  MenuShortcut,
  FeaturedRecipe,
} from "../types/home.types";

export const userProfile: UserProfile = {
  name: "Marlana Carla",
  greeting: "Boa noite",
  avatarUrl: "/images/avatar.png",
};

export const menuShortcuts: MenuShortcut[] = [
  { id: "1", label: "Receitas", icon: "book" },
  { id: "2", label: "Produtos", icon: "basket" },
  { id: "3", label: "Fornecedores", icon: "cart" },
  { id: "4", label: "Ifood", icon: "bike" },
  { id: "5", label: "Chás", icon: "cup" },
  { id: "6", label: "Substituição", icon: "check" },
  { id: "7", label: "Bem-estar", icon: "heart" },
  { id: "8", label: "Dicas", icon: "lamp" },
];

export const featuredRecipes: FeaturedRecipe[] = [
  { id: "1", title: "ABACATE: (MOUSSE DE CACAU.)", icon: "leaf" },
  { id: "2", title: "ALMONDEGAS DE FRANGO", icon: "leaf" },
  { id: "3", title: "AMENDOCA", icon: "leaf" },
  { id: "4", title: "AMENDOCA", icon: "taco" },
];
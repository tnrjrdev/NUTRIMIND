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
  { id: "1", label: "Receitas", icon: "book", path: "/receitas" },
  { id: "2", label: "Produtos", icon: "basket", path: "/produtos" },
  { id: "3", label: "Fornecedores", icon: "cart", path: "/fornecedores" },
  { id: "4", label: "Ifood", icon: "bike", path: "/ifood" },
  { id: "5", label: "Chas", icon: "cup", path: "/chas" },
  { id: "6", label: "Lista Subs.", icon: "check", path: "/substituicoes" },
  { id: "7", label: "Bem-estar", icon: "heart", path: "/bem-estar" },
  { id: "8", label: "Dicas", icon: "lamp", path: "/dicas" },
];

export const featuredRecipes: FeaturedRecipe[] = [
  { id: "1", title: "ABACATE: (MOUSSE DE CACAU.)", icon: "leaf" },
  { id: "2", title: "ALMONDEGAS DE FRANGO", icon: "leaf" },
  { id: "3", title: "AMENDOCA", icon: "leaf" },
  { id: "4", title: "AMENDOCA", icon: "taco" },
];

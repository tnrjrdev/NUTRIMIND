export type UserProfile = {
  name: string;
  greeting: string;
  avatarUrl: string;
};

export type MenuShortcut = {
  id: string;
  label: string;
  icon: string;
  path?: string;
};

export type FeaturedRecipe = {
  id: string;
  title: string;
  icon: string;
};
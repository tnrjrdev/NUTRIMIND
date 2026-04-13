import type { Product, ProductCategory } from "../types/products.types";

export const productCategories: ProductCategory[] = [
  { id: "1", name: "Suplementos", icon: "pill", productCount: 12 },
  { id: "2", name: "Proteínas", icon: "protein", productCount: 8 },
  { id: "3", name: "Vitaminas", icon: "vitamin", productCount: 15 },
  { id: "4", name: "Chás e Infusões", icon: "tea", productCount: 6 },
  { id: "5", name: "Óleos Essenciais", icon: "oil", productCount: 9 },
  { id: "6", name: "Produtos Naturais", icon: "leaf", productCount: 11 },
];

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Whey Protein Isolado",
    description: "Proteína de alta qualidade, zero lactose",
    price: 89.90,
    image: "/images/products/whey-protein.jpg",
    category: "Proteínas",
    inStock: true,
  },
  {
    id: "2",
    name: "Vitamina D3 + K2",
    description: "Suporte para ossos e sistema imunológico",
    price: 45.50,
    image: "/images/products/vitamin-d3.jpg",
    category: "Vitaminas",
    inStock: true,
  },
  {
    id: "3",
    name: "Óleo de Coco Extra Virgem",
    description: "Fonte de energia saudável e sustentável",
    price: 32.90,
    image: "/images/products/coconut-oil.jpg",
    category: "Produtos Naturais",
    inStock: true,
  },
  {
    id: "4",
    name: "Chá Verde Orgânico",
    description: "Antioxidante natural, 100% orgânico",
    price: 18.90,
    image: "/images/products/green-tea.jpg",
    category: "Chás e Infusões",
    inStock: true,
  },
];
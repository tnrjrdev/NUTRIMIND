export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}
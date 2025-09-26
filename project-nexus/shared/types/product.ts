export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  description?: string;
}
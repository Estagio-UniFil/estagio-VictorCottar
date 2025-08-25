export interface Product {
  id?: number;
  name: string;
  code: string;
  price: number;
  user?: {
    name?: string;
  };
  available?: number;
}
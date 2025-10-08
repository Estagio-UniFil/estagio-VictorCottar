import { SaleItem } from "./saleItem";

export interface Sale  {
  id: number;
  costumer_name?: string | null;
  costumerId?: number;
  userId?: number;
  user_name?: string;
  date: string;
  items: SaleItem[];
};
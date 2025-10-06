import { SaleItem } from "./saleItem";

export interface Sale  {
  id: number;
  costumer_name?: string | null;
  costumerId?: number;
  userId?: number;
  date: string;
  items: SaleItem[];
};
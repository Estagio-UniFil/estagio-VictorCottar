import { SaleItem } from "./saleItem";

export interface Sale {
  id?: number;
  costumer_id: number;
  costumer_name: string;
  date: string;
  user_id: number;
  items: SaleItem[];
}

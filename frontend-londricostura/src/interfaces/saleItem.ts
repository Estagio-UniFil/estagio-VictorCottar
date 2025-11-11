export interface SaleItem {
  id: number;
  saleId: number;
  product_id: number;
  product_name: string | null;
  product_code: string | null;
  quantity: number;
  price: number | string;
  total: number;
};
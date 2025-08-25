export interface Inventory {
  product_id: number;
  movement_type: 'IN' | 'OUT';
  quantity: number;
}

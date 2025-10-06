import { Expose } from 'class-transformer';

export class SaleItemResponseDto {
  @Expose() id: number;
  @Expose() saleId: number;
  @Expose() product_id: number;
  @Expose() product_name: string;
  @Expose() product_code: string;
  @Expose() quantity: number;
  @Expose() price: number | string;
  @Expose() total: number;
}

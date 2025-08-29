import { Expose, Transform } from 'class-transformer';

export class SaleItemResponseDto {
  @Expose() id: number;

  @Expose()
  @Transform(({ obj }) => obj.productId)
  product_id: number;

  @Expose()
  @Transform(({ obj }) => obj.product?.name ?? null)
  product_name: string | null;

  @Expose() quantity: number;

  @Expose() price: string; // unitário
}

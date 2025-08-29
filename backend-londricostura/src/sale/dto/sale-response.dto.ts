import { Expose, Transform, Type } from 'class-transformer';
import { SaleItemResponseDto } from 'src/sale-item/dto/sale-item-response.dto';

export class SaleResponseDto {
  @Expose() id: number;

  @Expose()
  @Transform(({ obj }) => obj.costumerId)
  costumer_id: number;

  @Expose() date: string;

  @Expose()
  @Transform(({ obj }) => obj.userId)
  user_id: number;

  @Expose()
  @Type(() => SaleItemResponseDto)
  items: SaleItemResponseDto[];
}

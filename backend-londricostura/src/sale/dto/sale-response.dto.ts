import { Expose, Type } from 'class-transformer';
import { SaleItemResponseDto } from 'src/sale-item/dto/sale-item-response.dto';

export class SaleResponseDto {
  @Expose() id: number;
  @Expose() costumer_name?: string;
  @Expose() costumerId?: number;
  @Expose() userId?: number;
  @Expose() date: string;

  @Expose()
  @Type(() => SaleItemResponseDto)
  items: SaleItemResponseDto[];
}
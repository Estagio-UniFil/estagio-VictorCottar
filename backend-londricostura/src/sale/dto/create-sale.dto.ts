import { Type } from 'class-transformer';
import { IsArray, ArrayMinSize, IsDateString, IsInt, Min, ValidateNested } from 'class-validator';

class CreateSaleItemInlineDto {
  @IsInt() product_id: number;
  @IsInt() @Min(1) quantity: number;
  @Type(() => Number) price?: number; // se não vier, pega do Product
}

export class CreateSaleDto {
  @IsInt() costumer_id: number;
  @IsDateString() date: string;
  @IsInt() user_id: number;

  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemInlineDto)
  items: CreateSaleItemInlineDto[];
}

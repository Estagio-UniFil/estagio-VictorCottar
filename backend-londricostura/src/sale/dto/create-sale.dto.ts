import { Type } from 'class-transformer';
import { IsArray, ArrayMinSize, IsDateString, IsInt, Min, ValidateNested, IsString } from 'class-validator';

class CreateSaleItemInlineDto {
  @IsInt() product_id: number;
  @IsInt() @Min(1) quantity: number;
  @Type(() => Number) price?: number;
}

export class CreateSaleDto {
  @IsInt() costumer_id: number;
  @IsString() costumer_name: string;
  @IsDateString() date: string;
  @IsInt() user_id: number;


  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemInlineDto)
  items: CreateSaleItemInlineDto[];
}

import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Código do produto é obrigatório.' })
  @IsString()
  code: string;

  @IsNotEmpty({ message: 'Quantidade é obrigatória.' })
  @IsNumber()
  quantity: number; 

  @IsNotEmpty({ message: 'Preço é obrigatório.' })
  @Transform(({ value }) => parseFloat(String(value).replace(',', '.')))
  @IsNumber()
  price: number;
}
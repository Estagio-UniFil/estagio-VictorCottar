import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Código do produto é obrigatório.' })
  @IsString()
  code: string;

  @IsNotEmpty({ message: 'Preço é obrigatório.' })
  @Min(0.01, { message: 'Preço deve ser maior ou igual a 0.01.' })
  @Transform(({ value }) => parseFloat(String(value).replace(',', '.')))
  @IsNumber()
  price: number;
}
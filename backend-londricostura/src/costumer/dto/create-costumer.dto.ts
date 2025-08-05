import {
  IsNotEmpty,
  IsString,
  Max,
  Min
} from 'class-validator';

export class CreateCostumerDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @Min(11, { message: 'O telefone deve ter 11 dígitos.' })
  @Max(11, { message: 'O telefone deve ter 11 dígitos.' })
  phone: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  city_id: number;
}
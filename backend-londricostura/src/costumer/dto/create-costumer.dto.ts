import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCostumerDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @IsString()
  @Matches(/^[0-9]{11}$/, {
    message:
      'Telefone deve conter exatamente 11 dígitos numéricos (DDD + número, sem espaços).',
  })
  phone: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória.' })
  city_id: number;
}
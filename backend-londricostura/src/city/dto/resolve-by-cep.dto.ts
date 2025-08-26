import { IsNotEmpty, Matches } from 'class-validator';

export class ResolveByCepDto {
  @IsNotEmpty({ message: 'CEP é obrigatório.' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos.' })
  cep: string;
}

import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { CreateCostumerDto } from './create-costumer.dto';

export class UpdateCostumerDto extends PartialType(CreateCostumerDto) {
  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos numéricos.' })
  cep?: string;

  @IsString()
  neighborhood?: string;

  @IsString()
  street?: string;

  @ValidateIf(o => o.number !== undefined)
  @IsInt({ message: 'Número deve ser inteiro.' })
  @Min(1, { message: 'Número deve ser maior que 0.' })
  number?: number;
}

import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsBrazilianState } from '../../validators/is-brazilian-state.validator';

export class CreateCityDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @MaxLength(30, { message: 'Nome deve ter no máximo 30 caracteres.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Estado é obrigatório.' })
  @IsBrazilianState({ message: 'Estado deve ser uma sigla válida do Brasil (ex: SP, RJ, MG).' })
  @MaxLength(2, { message: 'Estado deve ter no máximo 2 caracteres.' })
  state: string;

}
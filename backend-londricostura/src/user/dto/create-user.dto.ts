import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Senha deve ter pelo menos 4 caracteres.' })
  password: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean; 

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Password must be at least 4 characters long.' })
  password: string;
}
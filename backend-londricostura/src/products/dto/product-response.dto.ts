import { Expose, Type } from 'class-transformer';

class UserMinimal {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  price: number;

  // Solução 1: Usando Type() para transformar automaticamente
  @Expose()
  @Type(() => UserMinimal)
  user: UserMinimal;

  @Expose()
  user_id: number;

  @Expose()
  deletedAt: Date | null;
}
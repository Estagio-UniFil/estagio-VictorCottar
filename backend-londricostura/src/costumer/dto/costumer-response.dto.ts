import { Expose, Type } from 'class-transformer';

class UserMinimal {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class CityMinimal {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  state: string;
}

export class CostumerResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  @Type(() => CityMinimal)
  city: CityMinimal;

  @Expose()
  @Type(() => UserMinimal)
  user: UserMinimal;

  @Expose()
  user_id: number;

  @Expose()
  deletedAt: Date | null;
}
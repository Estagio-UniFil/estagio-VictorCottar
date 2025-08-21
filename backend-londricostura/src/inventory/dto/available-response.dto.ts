import { Expose } from 'class-transformer';

export class AvailableResponseDto {

  @Expose()
  product?: {
    name: string;
    code: string;
    price: number;
  };

  @Expose()
  quantity: number;
}

import { Expose } from 'class-transformer';

export class MovementResponseDto {
  @Expose()
  id: number;

  @Expose()
  product_id: number;

  @Expose()
  movement_type: 'IN' | 'OUT';

  @Expose()
  quantity: number;

  @Expose()
  product?: {
    id: number;
    name: string;
    code: string;
    price: number;
  };

  @Expose()
  createdAt: Date;
}

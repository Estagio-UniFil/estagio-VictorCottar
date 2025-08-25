// inventory/dto/available-response.dto.ts
import { Expose } from 'class-transformer';

export class AvailableResponseDto {
  @Expose()
  product?: { name: string; code: string; price: number };

  @Expose()
  available: number; // renomeado de "quantity" para alinhar com o front
}

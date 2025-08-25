// inventory/dto/create-movement.dto.ts
import { IsIn, IsInt, IsNotEmpty, Min } from 'class-validator';
import { MovementType } from '../entities/inventory.entity';

export class CreateMovementDto {
  @IsNotEmpty({ message: 'ID do produto é obrigatório.' })
  @IsInt({ message: 'ID do produto deve ser um inteiro.' })
  product_id: number;

  @IsNotEmpty({ message: 'Movimentação é obrigatória.' })
  @IsIn(['IN', 'OUT'], { message: "Movimentação deve ser 'IN' ou 'OUT'." })
  movement_type: MovementType;

  @IsNotEmpty({ message: 'Quantidade é obrigatória.' })
  @IsInt({ message: 'Quantidade deve ser inteiro.' })
  @Min(1, { message: 'Quantidade deve ser pelo menos 1.' })
  quantity: number;
}

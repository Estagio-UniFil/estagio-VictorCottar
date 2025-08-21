import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { plainToInstance } from 'class-transformer';
import { MovementResponseDto } from './dto/movement-response.dto';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post()
  async create(@Body() dto: CreateMovementDto) {
    const movement = await this.inventoryService.register(dto);
    const data = plainToInstance(MovementResponseDto, {
      ...movement,
      product: movement.product
        ? {
          id: movement.product.id,
          name: movement.product.name,
          code: movement.product.code,
          price: movement.product.price,
        }
        : undefined,
    }, { excludeExtraneousValues: true });

    return {
      message: 'Movimentação registrada com sucesso.',
      data,
    };
  }

  @Get('available/:id')
  async available(@Param('id', ParseIntPipe) id: number) {
    const available = await this.inventoryService.getAvailable(id);
    return {
      message: 'Quantidade disponível obtida com sucesso.',
      data: { product_id: id, available },
    };
  }
}

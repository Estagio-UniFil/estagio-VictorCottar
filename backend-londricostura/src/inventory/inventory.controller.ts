import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
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

  @Get('available')
  async availableBulk(@Query('ids') ids: string) {
    const arr = (ids || '')
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => Number.isInteger(n) && n > 0);

    const data = await this.inventoryService.getAvailableBulk(arr);
    return { message: 'Disponibilidade obtida com sucesso.', data };
  }

  @Get('available/:id')
  async available(@Param('id', ParseIntPipe) id: number) {

    const dto = await this.inventoryService.getAvailable(id);
    return {
      message: 'Quantidade disponível obtida com sucesso.',
      data: { product_id: id, ...dto },
    };

  }

  @Get('logs')
  async getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('movement_type') movementType?: string,
    @Query('product_id') productId?: string,
  ) {
    const data = await this.inventoryService.getLogs(
      Number(page) || 1,
      Number(limit) || 10,
      movementType as any,
      productId ? Number(productId) : undefined,
    );
    
    return {
      message: 'Logs obtidos com sucesso.',
      ...data,
    };
  }
}


import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SaleItemService } from './sale-item.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { SaleItemResponseDto } from './dto/sale-item-response.dto';

@Controller('sale-item')
export class SaleItemController {
  constructor(private readonly service: SaleItemService) { }

  @Post()
  async create(@Body() dto: CreateSaleItemDto) {
    const item = await this.service.create(dto);
    const data = plainToInstance(SaleItemResponseDto, item, { excludeExtraneousValues: true });
    return { message: 'Item adicionado', data };
  }

  @Get()
  async findAll() {
    const items = await this.service.findAll();
    const data = items.map(i => plainToInstance(SaleItemResponseDto, i, { excludeExtraneousValues: true }));
    return { message: 'Itens', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(+id);
    const data = plainToInstance(SaleItemResponseDto, item, { excludeExtraneousValues: true });
    return { message: 'Item', data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSaleItemDto) {
    const item = await this.service.update(+id, dto);
    const data = plainToInstance(SaleItemResponseDto, item, { excludeExtraneousValues: true });
    return { message: 'Item atualizado', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(+id);
    return { message: 'Item removido' };
  }
}

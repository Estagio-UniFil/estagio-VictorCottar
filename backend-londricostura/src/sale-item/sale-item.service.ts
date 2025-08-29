import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { AvailableResponseDto } from 'src/inventory/dto/available-response.dto';

@Injectable()
export class SaleItemService {
  constructor(
    @InjectRepository(SaleItem) private readonly repo: Repository<SaleItem>,
    private readonly inventory: InventoryService,
  ) { }

  async create(dto: CreateSaleItemDto) {
    const available = await this.inventory.getAvailable(dto.product_id);
    if (available.available < dto.quantity) throw new BadRequestException('Estoque insuficiente');

    const priceSource = dto.price ?? Number(available.product?.price ?? 0);

    const item = this.repo.create({
      saleId: dto.sale_id,
      productId: dto.product_id,
      quantity: dto.quantity,
      price: Number(priceSource).toFixed(2),
    });
    const saved = await this.repo.save(item);

    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['product'], // mesmo com eager, isso é explícito e confiável
    });

    await this.inventory.register({
      product_id: dto.product_id,
      quantity: -dto.quantity,
      movement_type: 'OUT',
    });

    return full!;
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }

  async update(id: number, dto: UpdateSaleItemDto) {
    const before = await this.findOne(id);

    if (dto.quantity && dto.quantity !== before.quantity) {
      const diff = dto.quantity - before.quantity;
      if (diff > 0) {
        const available = await this.inventory.getAvailable(before.productId);
        if (available.available < diff) throw new BadRequestException('Estoque insuficiente para aumentar a quantidade');
      }
      await this.inventory.register({
        product_id: before.productId,
        quantity: -diff,
        movement_type: 'OUT',
      });
    }

    await this.repo.update({ id }, {
      quantity: dto.quantity ?? undefined,
      price: dto.price != null ? Number(dto.price).toFixed(2) : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const it = await this.findOne(id);
    await this.inventory.register({
      product_id: it.productId,
      quantity: it.quantity,
      movement_type: 'OUT',
    });
    await this.repo.delete({ id });
  }
}

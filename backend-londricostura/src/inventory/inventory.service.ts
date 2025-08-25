import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Product } from 'src/products/entities/product.entity';
import { AvailableResponseDto } from './dto/available-response.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async register(dto: CreateMovementDto): Promise<Inventory> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    if (dto.movement_type === 'OUT') {
      const availableResponse = await this.getAvailable(dto.product_id);
      if (dto.quantity > availableResponse.available) {
        throw new ConflictException('Quantidade indisponível em estoque para esta saída.');
      }
    }

    const movement = this.inventoryRepository.create({
      product,
      product_id: dto.product_id,
      movement_type: dto.movement_type,
      quantity: dto.quantity,
    });

    return this.inventoryRepository.save(movement);
  }

  async getAvailable(productId: number): Promise<AvailableResponseDto> {
    const raw = await this.inventoryRepository
      .createQueryBuilder('i')
      .select(
        "COALESCE(SUM(CASE WHEN i.movement_type = 'IN' THEN i.quantity ELSE -i.quantity END), 0)",
        'available',
      )
      .where('i.product_id = :productId', { productId })
      .getRawOne<{ available: string }>();

    const available = Number(raw?.available ?? 0);

    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: ['id', 'name', 'code', 'price'],
    });

    if (!product) throw new NotFoundException('Produto não encontrado.');

    return {
      product: {
        name: product.name,
        code: product.code,
        price: product.price,
      },
      available: available,
    };
  }

  async getAvailableBulk(productIds: number[]) {
    if (!productIds?.length) return [];
    const rows = await this.inventoryRepository
      .createQueryBuilder('i')
      .select('i.product_id', 'product_id')
      .addSelect(
        "COALESCE(SUM(CASE WHEN i.movement_type = 'IN' THEN i.quantity ELSE -i.quantity END), 0)",
        'available',
      )
      .where('i.product_id IN (:...ids)', { ids: productIds })
      .groupBy('i.product_id')
      .getRawMany<{ product_id: number; available: string }>();

    const map = new Map<number, number>();
    for (const id of productIds) map.set(id, 0);
    for (const r of rows) map.set(Number(r.product_id), Number(r.available));

    return Array.from(map.entries()).map(([product_id, available]) => ({ product_id, available }));
  }
}

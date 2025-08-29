import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Product } from 'src/products/entities/product.entity';
import { SaleItem } from 'src/sale-item/entities/sale-item.entity';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class SaleService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly itemRepo: Repository<SaleItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly inventory: InventoryService,
  ) { }

  async create(dto: CreateSaleDto): Promise<Sale> {
    return this.dataSource.transaction(async (manager) => {
      const productIds = dto.items.map(i => i.product_id);
      const products = await manager.getRepository(Product).find({ where: { id: In(productIds) } });
      const byId = new Map(products.map(p => [p.id, p]));

      for (const it of dto.items) {
        const prod = byId.get(it.product_id);
        if (!prod) throw new NotFoundException(`Produto ${it.product_id} não encontrado`);
        const available = await this.inventory.getAvailable(it.product_id);
        if (available.available < it.quantity) {
          throw new BadRequestException(`Estoque insuficiente para ${prod.name}. Disponível: ${available.available}`);
        }
      }

      const sale = manager.create(Sale, {
        costumerId: dto.costumer_id,
        userId: dto.user_id,
        date: dto.date,
      });
      await manager.save(sale);



      const items: SaleItem[] = [];
      for (const it of dto.items) {
        const prod = byId.get(it.product_id)!;
        const priceUnit = it.price ?? Number((prod as any).price ?? 0);
        const item = manager.create(SaleItem, {
          saleId: sale.id,
          productId: it.product_id,
          quantity: it.quantity,
          price: Number(priceUnit).toFixed(2),
        });
        items.push(item);

        await this.inventory.register({
          product_id: it.product_id,
          quantity: it.quantity,
          movement_type: 'OUT',
        });
      }
      await manager.save(items);
      const saleRepo = manager.getRepository(Sale);
      const fullSale = await saleRepo.findOne({
        where: { id: sale.id },
        relations: ['items', 'items.product', 'costumer', 'user'],
      });
      return fullSale!;
    });
  }

  async findAllPaginated(page = 1, limit = 10) {
    const [data, total] = await this.saleRepo.findAndCount({
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Venda não encontrada');
    return sale;
  }

  async update(id: number, dto: UpdateSaleDto) {
    await this.saleRepo.update({ id }, {
      costumerId: dto.costumer_id ?? undefined,
      date: dto.date ?? undefined,
      userId: dto.user_id ?? undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) return;

    for (const it of sale.items ?? []) {
      await this.inventory.register({
        product_id: it.productId,
        quantity: it.quantity,
        movement_type: 'OUT',
      });
    }
    await this.saleRepo.softRemove(sale);
  }
}

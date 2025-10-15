import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, Between } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Product } from 'src/products/entities/product.entity';
import { SaleItem } from 'src/sale-item/entities/sale-item.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { SaleResponseDto } from './dto/sale-response.dto';

@Injectable()
export class SaleService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly itemRepo: Repository<SaleItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly inventory: InventoryService,
  ) { }

  private transformSale(sale: any): SaleResponseDto {
    return {
      id: sale.id,
      costumerId: sale.costumerId,
      userId: sale.userId,
      user_name: sale.user?.name || 'Não informado',
      date: sale.date,
      costumer_name: sale.costumer?.name ?? null,
      items: (sale.items ?? []).map((item: any) => ({
        id: item.id,
        saleId: item.saleId,
        product_id: item.productId,
        product_name: item.product?.name ?? null,
        product_code: item.product?.code ?? null,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.price) * item.quantity,
      })),
    };
  }

  async create(dto: CreateSaleDto): Promise<any> {
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
        costumerName: dto.costumer_name,
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
        relations: {
          costumer: true,
          user: true,
          items: {
            product: true,
          },
        },
      });

      return this.transformSale(fullSale!);
    });
  }

  async findAllPaginated(page = 1, limit = 10) {
    const [data, total] = await this.saleRepo.findAndCount({
      relations: {
        costumer: true,
        user: true,
        items: {
          product: true,
        },
      },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const transformedData = data.map(sale => this.transformSale(sale)!);
    return { data: transformedData, total, page, limit };
  }

  async findOne(id: number) {
    const sale = await this.saleRepo.findOne({
      where: { id },
      relations: {
        costumer: true,
        user: true,
        items: {
          product: true,
        },
      },
    });
    if (!sale) throw new NotFoundException('Venda não encontrada');

    return this.transformSale(sale);
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
    const sale = await this.saleRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!sale) return;

    for (const it of sale.items ?? []) {
      await this.inventory.register({
        product_id: it.productId,
        quantity: it.quantity,
        movement_type: 'IN',
      });
    }
    await this.saleRepo.softRemove(sale);
  }

  async reportMonthly(year: number) {
    const rows = await this.saleRepo.createQueryBuilder('s')
      .leftJoin('s.items', 'si')
      .select("TO_CHAR(s.date::timestamp, 'MM')", 'month')
      .addSelect('COUNT(DISTINCT s.id)', 'count')
      .addSelect("COALESCE(SUM(si.quantity * CAST(si.price as decimal)), 0)", 'total')
      .where("EXTRACT(YEAR FROM s.date::timestamp) = :year", { year })
      .groupBy("TO_CHAR(s.date::timestamp, 'MM')")
      .orderBy("TO_CHAR(s.date::timestamp, 'MM')", 'ASC')
      .getRawMany<{ month: string; count: string; total: string }>();

    return rows.map(r => ({
      month: r.month,
      count: Number(r.count),
      total: Number(r.total)
    }));
  }

  async reportByPeriod(start: string, end: string) {
    const rows = await this.saleRepo.createQueryBuilder('s')
      .leftJoin('s.costumer', 'c')
      .leftJoin('s.items', 'si')
      .select("TO_CHAR(s.date, 'YYYY-MM-DD')", 'date')
      .addSelect("COALESCE(c.name, s.costumerName)", 'customer')
      .addSelect("COALESCE(SUM(si.quantity * CAST(si.price as decimal)), 0)", 'total')
      .where('s.date BETWEEN :start AND :end', { start, end })
      .groupBy('s.id, c.name, s.costumerName, s.date')
      .orderBy('s.date', 'ASC')
      .getRawMany<{ date: string; customer: string; total: string }>();

    return rows.map(r => ({ date: r.date, customer: r.customer, total: Number(r.total) }));
  }
}

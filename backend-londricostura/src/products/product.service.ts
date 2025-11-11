import { InventoryService } from 'src/inventory/inventory.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

type ImportItem = { code: string; name: string; price: number; quantity: number };

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly inventoryService: InventoryService,
    private readonly ds: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: [
        { code: createProductDto.code },
        { name: createProductDto.name },
      ],
    });

    if (existingProduct) {
      if (existingProduct.code === createProductDto.code) {
        throw new ConflictException('Já existe um produto cadastrado com este código.');
      } else {
        throw new ConflictException('Já existe um produto cadastrado com este nome.');
      }
    }

    // associa ao usuário recebido via token
    const product = this.productRepository.create({
      ...createProductDto,
      user: { id: userId } as User,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['user'] }); // por padrão ele já busca sem os deletados.
  }

  async findAllWithDeleteds(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['user'], withDeleted: true });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filterField?: keyof Product,
    filterValue?: string,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.id', 'ASC');

    if (filterField && filterValue) {
      query.andWhere(`product.${filterField} ILIKE :value`, { value: `%${filterValue}%` });
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!product) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.code && updateProductDto.code !== product.code) {
      const productWithSameCode = await this.productRepository.findOne({
        where: { code: updateProductDto.code }
      });

      if (productWithSameCode) {
        throw new ConflictException('Já existe um produto cadastrado com este código.');
      }
    }

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const productWithSameName = await this.productRepository.findOne({
        where: { name: updateProductDto.name }
      });

      if (productWithSameName) {
        throw new ConflictException('Já existe um produto cadastrado com este nome.');
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepository.softDelete(id);
  }

  async reportStock() {
    try {
      const products = await this.productRepository.find({
        select: ['id', 'name', 'code', 'price'],
        order: { id: 'ASC' },
      });

      if (products.length === 0) {
        return [];
      }

      const ids = products.map(p => p.id);

      const bulk = await this.inventoryService.getAvailableBulk(ids);

      const map = new Map(
        bulk.map(b => [Number(b.product_id), Number(b.available)])
      );

      return products.map(p => {
        const quantity = Number(map.get(p.id) ?? 0);
        const price = Number(p.price);
        return {
          id: p.id,
          name: p.name,
          code: p.code,
          quantity,
          price,
          total: Number((price * quantity).toFixed(2)),
        };
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de estoque:', error);
      throw error;
    }
  }

  async getStockIndicators() {
    // Total de itens em estoque
    const products = await this.productRepository.find({
      select: ['id'],
    });

    if (products.length === 0) {
      return {
        totalStock: 0,
      };
    }

    const ids = products.map(p => p.id);
    const bulk = await this.inventoryService.getAvailableBulk(ids);

    const totalStock = bulk.reduce((sum, item) => {
      return sum + Number(item.available);
    }, 0);

    return {
      totalStock: Number(totalStock),
    };
  }

  async importConfirm(items: ImportItem[], userId: number) {
    let inserted = 0;
    let updated = 0;
    let stockMovements = 0;

    await this.ds.transaction(async (manager) => {
      const repo = manager.getRepository(Product);

      for (const it of items) {
        let product = await repo.findOne({ where: { code: it.code } });

        if (!product) {
          product = repo.create({
            code: it.code.trim(),
            name: it.name.trim(),
            price: Number(it.price),
            user_id: userId || 1, // ajuste se obrigatório
          });
          await repo.save(product);
          inserted++;
        } else {
          // atualiza nome/preço se mudou
          const newPrice = Number(it.price);
          const needName = product.name !== it.name.trim();
          const needPrice = Number(product.price) !== newPrice;
          if (needName || needPrice) {
            product.name = it.name.trim();
            product.price = newPrice as any; // decimal
            await repo.save(product);
            updated++;
          }
        }

        const qty = Number(it.quantity) || 0;
        if (qty > 0) {
          await this.inventoryService.createMovementInTx(manager, {
            product_id: product.id,
            quantity: qty,
          });
          stockMovements++;
        }
      }
    });

    return { inserted, updated, stockMovements };
  }

}
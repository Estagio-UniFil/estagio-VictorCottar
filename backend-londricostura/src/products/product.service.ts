import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
}
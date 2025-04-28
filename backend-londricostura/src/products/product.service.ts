import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: [
        { product_code: createProductDto.product_code },
        { name: createProductDto.name }
      ]
    });

    if (existingProduct) {
      if (existingProduct.product_code === createProductDto.product_code) {
        throw new ConflictException('Já existe um produto cadastrado com este código.');
      } else {
        throw new ConflictException('Já existe um produto cadastrado com este nome.');
      }
    }

    return this.productRepository.save(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    // ajusta limites
    limit = Math.min(limit, 100);
    page = Math.max(page, 1);

    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.product_code && updateProductDto.product_code !== product.product_code) {
      const productWithSameCode = await this.productRepository.findOne({
        where: { product_code: updateProductDto.product_code }
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
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
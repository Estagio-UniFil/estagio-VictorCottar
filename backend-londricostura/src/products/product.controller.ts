import { Controller, Get, Post, Put, Delete, Body, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser('id') userId: number,
  ) {
    const product = await this.productService.create(createProductDto, userId);
    const productResponse = plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
    return {
      message: 'Produto criado com sucesso.',
      data: productResponse,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.productService.findAllPaginated(page, limit);
    const data = result.data.map(prod =>
      plainToInstance(ProductResponseDto, prod, { excludeExtraneousValues: true }),
    );

    return {
      message: 'Produtos encontrados com sucesso.',
      data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('findWithDeleted')
  @UseGuards(AuthGuard('jwt'))
  async findAllWithDeleted() {
    const products = await this.productService.findAllWithDeleteds();
    const data = products.map((prod) =>
      plainToInstance(ProductResponseDto, prod, { excludeExtraneousValues: true }),
    );

    return {
      message: 'Produtos encontrados com sucesso.',
      data,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    const productResponse = plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Produto encontrado com sucesso.',
      data: productResponse,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updated = await this.productService.update(+id, updateProductDto);
    return {
      message: 'Produto atualizado com sucesso.',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    await this.productService.remove(+id);
    return {
      message: 'Produto removido com sucesso.',
    };
  }
}

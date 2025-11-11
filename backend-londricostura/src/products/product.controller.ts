import { Controller, Get, Post, Put, Delete, Body, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from './entities/product.entity';
import { ImportConfirmDto } from './dto/import-confirm.dto';

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

  @Get('paginated')
  @UseGuards(AuthGuard('jwt'))
  async findAllPaginated(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filterField') filterField?: keyof Product,
    @Query('filterValue') filterValue?: string,
  ) {
    return this.productService.findAllPaginated(
      Number(page),
      Number(limit),
      filterField,
      filterValue,
    );
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

  @Get('stock-report')
  async stockReport() {
    const data = await this.productService.reportStock();
    return { message: 'Relatório de estoque gerado com sucesso.', data };
  }

  @Get('indicators/stock')
  async getIndicadoresEstoque() {
    const data = await this.productService.getStockIndicators();
    return {
      message: 'Indicadores de estoque',
      data
    };
  }

  @Post("import/confirm")
  async importConfirm(@Body() dto: ImportConfirmDto, @Req() req: any) {
    const userId = Number(req?.user?.id) || 0;
    const result = await this.productService.importConfirm(dto.items, userId);
    return { inserted: result.inserted, updated: result.updated, stockMovements: result.stockMovements };
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

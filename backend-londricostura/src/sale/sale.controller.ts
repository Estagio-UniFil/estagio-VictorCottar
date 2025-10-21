import { Controller, Get, Post, Body, Param, Query, Put, Delete, ParseIntPipe, DefaultValuePipe, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleResponseDto } from './dto//sale-response.dto';

@Controller('sale')
export class SaleController {
  constructor(private readonly service: SaleService) { }

  @Post()
  async create(@Body() dto: CreateSaleDto) {
    const sale = await this.service.create(dto);
    const data = plainToInstance(SaleResponseDto, sale, { excludeExtraneousValues: true });
    return { message: 'Venda criada', data };
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const res = await this.service.findAllPaginated(+page, +limit);
    const data = res.data.map(s => plainToInstance(SaleResponseDto, s, { excludeExtraneousValues: true }));
    return { message: 'Lista de vendas', data, total: res.total, page: res.page, limit: res.limit };
  }

  @Get('reports/monthly')
  async reportMonthly(
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    const data = await this.service.reportMonthly(year);
    return { message: 'Relatório de vendas mensais gerado com sucesso.', data };
  }

  @Get('reports/by-period')
  async reportByPeriod(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    if (!start || !end) {
      throw new BadRequestException(
        'Parâmetros start e end são obrigatórios (YYYY-MM-DD).',
      );
    }
    const data = await this.service.reportByPeriod(start, end);
    return { message: 'Relatório de vendas por período gerado com sucesso.', data };
  }

  @Get('indicators/today')
  async getTodayIndicators() {
    const data = await this.service.getTodayIndicators();
    return {
      message: 'Indicadores de vendas de hoje',
      data
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = await this.service.findOne(+id);
    const data = plainToInstance(SaleResponseDto, sale, { excludeExtraneousValues: true });
    return { message: 'Venda', data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    const sale = await this.service.update(+id, dto);
    const data = plainToInstance(SaleResponseDto, sale, { excludeExtraneousValues: true });
    return { message: 'Venda atualizada', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(+id);
    return { message: 'Venda removida' };
  }
}

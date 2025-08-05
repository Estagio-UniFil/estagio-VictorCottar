import { Controller, Get, Post, Put, Delete, Body, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CostumerService } from './costumer.service';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { CostumerResponseDto } from './dto/costumer-response.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { plainToInstance } from 'class-transformer';
import { Costumer } from './entities/costumer.entity';

@Controller('costumer')
export class CostumerController {
  constructor(private readonly costumerService: CostumerService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCostumerDto: CreateCostumerDto,
    @GetUser('id') userId: number,
    @Body('city_id', ParseIntPipe) cityId: number
  ) {
    const costumer = await this.costumerService.create(createCostumerDto, userId, cityId);
    const costumerResponse = plainToInstance(CostumerResponseDto, costumer, { excludeExtraneousValues: true });
    return {
      message: 'Cliente criado com sucesso.',
      data: costumerResponse,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.costumerService.findAllPaginated(page, limit);
    const data = result.data.map(prod =>
      plainToInstance(CostumerResponseDto, prod, { excludeExtraneousValues: true }),
    );

    return {
      message: 'Clientes encontrados com sucesso.',
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
    @Query('filterField') filterField?: keyof Costumer,
    @Query('filterValue') filterValue?: string,
  ) {
    return this.costumerService.findAllPaginated(
      Number(page),
      Number(limit),
      filterField,
      filterValue,
    );
  }

  @Get('findWithDeleted')
  @UseGuards(AuthGuard('jwt'))
  async findAllWithDeleted() {
    const costumer = await this.costumerService.findAllWithDeleteds();
    const data = costumer.map((prod) =>
      plainToInstance(CostumerResponseDto, prod, { excludeExtraneousValues: true }),
    );

    return {
      message: 'Clientes encontrados com sucesso.',
      data,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const costumer = await this.costumerService.findOne(id);
    const costumerResponse = plainToInstance(CostumerResponseDto, costumer, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Cliente encontrado com sucesso.',
      data: costumerResponse,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateCostumerDto: UpdateCostumerDto,
  ) {
    const updated = await this.costumerService.update(+id, updateCostumerDto);
    return {
      message: 'Cliente atualizado com sucesso.',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    await this.costumerService.remove(+id);
    return {
      message: 'Cliente removido com sucesso.',
    };
  }
}

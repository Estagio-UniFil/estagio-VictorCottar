import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CostumerService } from './costumer.service';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { CostumerResponseDto } from './dto/costumer-response.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { plainToInstance } from 'class-transformer';
import { Costumer } from './entities/costumer.entity';
import { CityService } from 'src/city/city.service';

type FilterField = 'id' | 'name' | 'phone';
const ALLOWED_FIELDS: FilterField[] = ['id', 'name', 'phone'];

@Controller('costumer')
export class CostumerController {
  constructor(
    private readonly costumerService: CostumerService,
    private readonly cityService: CityService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCostumerDto: CreateCostumerDto,
    @GetUser('id') userId: number,
    @Body('city_id', ParseIntPipe) cityId: number,
    @Body('cep') cep: string,
    @Body('number') numberHouse: number
  ) {

    if (!cep || cep.trim() === '') {
      throw new BadRequestException('CEP não pode ser vazio');
    }

    const { id, name, state, neighborhood, street, } = await this.cityService.resolveByCep(cep);

    const costumer = await this.costumerService.create(createCostumerDto, userId, id, neighborhood, street, numberHouse);

    return {
      message: 'Cliente criado com sucesso.',
      data: costumer,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('filterField') filterField?: string,
    @Query('filterValue') filterValue?: string,
  ) {
    const ff = ALLOWED_FIELDS.includes(filterField as FilterField)
      ? (filterField as FilterField)
      : undefined;

    const result = await this.costumerService.findAllPaginated(page, limit, ff as keyof Costumer, filterValue);

    const data = result.data.map((prod) =>
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('filterField') filterField?: string,
    @Query('filterValue') filterValue?: string,
  ) {
    const ff = ALLOWED_FIELDS.includes(filterField as FilterField)
      ? (filterField as FilterField)
      : undefined;

    const result = await this.costumerService.findAllPaginated(page, limit, ff as keyof Costumer, filterValue);

    const data = result.data.map((prod) =>
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

import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ResolveByCepDto } from './dto/resolve-by-cep.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() CreateCityDto: CreateCityDto,
  ) {
    const city = await this.cityService.create(CreateCityDto);
    return {
      message: 'Cidade criada com sucesso.',
      data: city,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const users = await this.cityService.findAll();
    return {
      message: 'Cidades encontradas com sucesso.',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const city = await this.cityService.findOne(id);
    return {
      message: 'Cidade encontrada com sucesso.',
      data: city,
    };
  }

  @Post('resolve-by-cep')
  @UseGuards(AuthGuard('jwt'))
  async resolveByCep(@Body() dto: ResolveByCepDto) {
    const result = await this.cityService.resolveByCep(dto.cep);
    return {
      message: 'Cidade resolvida com sucesso.',
      data: result,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() UpdateCityDto: UpdateCityDto,
  ) {
    const updated = await this.cityService.update(+id, UpdateCityDto);
    return {
      message: 'Cidade atualizada com sucesso.',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    await this.cityService.remove(+id);
    return {
      message: 'Cidade removida com sucesso.',
    };
  }
}

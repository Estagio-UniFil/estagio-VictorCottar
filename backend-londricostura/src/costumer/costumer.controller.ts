import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('costumer')
@UseGuards(AuthGuard('jwt'))
export class CostumerController {
  constructor(private readonly costumerService: CostumerService) {}

  @Post()
  create(@Body() createCostumerDto: CreateCostumerDto, @GetUser() user: User) {
    return this.costumerService.create(
      createCostumerDto,
      user.id,
      createCostumerDto.city_id,
      createCostumerDto.neighborhood,
      createCostumerDto.street,
      createCostumerDto.number,
    );
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('city') city?: string,
    @Query('neighborhood') neighborhood?: string,
    @Query('street') street?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    const filters: any = {};
    if (search) filters.search = search;
    if (name) filters.name = name;
    if (phone) filters.phone = phone;
    if (city) filters.city = city;
    if (neighborhood) filters.neighborhood = neighborhood;
    if (street) filters.street = street;

    if (Object.keys(filters).length === 0) {
      return this.costumerService.findAllPaginated(pageNumber, limitNumber);
    }

    return this.costumerService.findAllPaginated(pageNumber, limitNumber, filters);
  }

  @Get('all')
  findAllWithoutPagination() {
    return this.costumerService.findAll();
  }

  @Get('with-deleted')
  findAllWithDeleted() {
    return this.costumerService.findAllWithDeleteds();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costumerService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCostumerDto: UpdateCostumerDto) {
    return this.costumerService.update(+id, updateCostumerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costumerService.remove(+id);
  }
}
import { City } from './entities/city.entity';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) { }

  async create(createCityDto: CreateCityDto): Promise<City> {

    const existingCityName = await this.cityRepository.findOne({
      where: { name: createCityDto.name },
    });

    if (existingCityName) {
      throw new ConflictException('Já existe uma cidade cadastrada com esse nome.');
    }

    const existingCity = await this.cityRepository.findOne({
      where: { name: createCityDto.name, state: createCityDto.state },
    });

    if (existingCity) {
      throw new ConflictException('Essa cidade já está cadastrada nesse estado.');
    }

    return this.cityRepository.save(createCityDto);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find(); // por padrão ele já busca sem os deletados.
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Cidade com id ${id} não encontrado.`);
    }
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);

    if (updateCityDto.name && updateCityDto.name !== city.name) {
      const existingCityWithSameName = await this.cityRepository.findOne({
        where: { name: updateCityDto.name },
      });

      if (existingCityWithSameName && existingCityWithSameName.id !== id) {
        throw new ConflictException('Já existe uma cidade cadastrada com este nome.');
      }
    }

    Object.assign(city, updateCityDto);
    return this.cityRepository.save(city);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.cityRepository.delete(id);
  }
}
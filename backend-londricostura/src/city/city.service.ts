import { City } from './entities/city.entity';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) { }

  private normalizeCep(cep: string) {
    if (!cep) {
      throw new Error('CEP não pode ser vazio');
    }
    return cep.replace(/\D/g, '').slice(0, 8);
  }

  private cleanName(s: string) {
    return s?.trim().replace(/\s+/g, ' ');
  }
  private cleanUf(uf: string) {
    return uf?.trim().toUpperCase();
  }

  async create(createCityDto: CreateCityDto): Promise<City> {
    const name = this.cleanName(createCityDto.name);
    const state = this.cleanUf(createCityDto.state);

    const existingCity = await this.cityRepository.findOne({
      where: { name: ILike(name), state },
    });
    if (existingCity) {
      throw new ConflictException('Essa cidade já está cadastrada nesse estado.');
    }

    return this.cityRepository.save({ name, state } as City);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Cidade com id ${id} não encontrada.`);
    }
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);

    if (updateCityDto.name || updateCityDto.state) {
      const name = this.cleanName(updateCityDto.name ?? city.name);
      const state = this.cleanUf(updateCityDto.state ?? city.state);

      const dup = await this.cityRepository.findOne({
        where: { name: ILike(name), state },
      });
      if (dup && dup.id !== id) {
        throw new ConflictException('Já existe uma cidade cadastrada com este nome/UF.');
      }

      city.name = name;
      city.state = state;
    }

    return this.cityRepository.save(city);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.cityRepository.delete(id);
  }

  async resolveByCep(cepRaw: string): Promise<{ id: number; name: string; state: string; neighborhood: string; street: string; }> {
    if (!cepRaw || cepRaw.trim() === '') {
      throw new BadRequestException('CEP não pode ser vazio');
    }

    const cep = this.normalizeCep(cepRaw);

    if (!/^\d{8}$/.test(cep)) {
      throw new BadRequestException('CEP inválido. Use 8 dígitos.');
    }

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const data = await response.json();

      if (!data.city || !data.neighborhood || !data.street || !data.state) {
        throw new InternalServerErrorException('Resposta incompleta da BrasilAPI');
      }

      const cityName = this.cleanName(data.city);
      const stateName = this.cleanUf(data.state);
      const neighborhood = this.cleanName(data.neighborhood);
      const street = this.cleanName(data.street);

      let city = await this.cityRepository.findOne({ where: { name: ILike(cityName), state: stateName } });

      if (!city) {
        city = await this.cityRepository.save({ name: cityName, state: stateName });
      }

      return { id: city.id, name: cityName, state: stateName, neighborhood, street };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao consultar a BrasilAPI.');
    }
  }
}


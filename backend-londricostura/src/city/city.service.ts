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
  ) {}

  private normalizeCep(cep: string) {
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

  async resolveByCep(cepRaw: string): Promise<{ id: number; name: string; state: string }> {
    const cep = this.normalizeCep(cepRaw);
    if (!/^\d{8}$/.test(cep)) {
      throw new BadRequestException('CEP inválido. Use 8 dígitos.');
    }

    let data: any;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!r.ok) throw new Error(`ViaCEP status ${r.status}`);
      data = await r.json();
    } catch {
      throw new InternalServerErrorException('Falha ao consultar CEP.');
    }
    if (data?.erro) throw new BadRequestException('CEP não encontrado.');

    const name = this.cleanName(data.localidade);
    const state = this.cleanUf(data.uf);
    if (!name || !state) {
      throw new InternalServerErrorException('Resposta de CEP sem localidade/UF.');
    }

    let city = await this.cityRepository.findOne({ where: { name: ILike(name), state } });

    if (!city) {

      try {
        await this.cityRepository.upsert({ name, state } as City, ['name', 'state']);
      } catch (e: any) {
        try {
          const qb: any = this.cityRepository
            .createQueryBuilder()
            .insert()
            .into(City)
            .values({ name, state });

          if (typeof qb.orIgnore === 'function') qb.orIgnore();
          await qb.execute();
        } catch (err: any) {
          const code = err?.code || err?.errno || err?.name || '';
          const msg = String(err?.message || '');
          const isDup =
            code === '23505' ||               
            code === 'ER_DUP_ENTRY' ||        
            code === 'SQLITE_CONSTRAINT' ||   
            /unique|duplicate/i.test(msg);    

          if (!isDup) {
            throw new InternalServerErrorException('Erro ao salvar cidade.');
          }
        }
      }

      city = await this.cityRepository.findOne({ where: { name: ILike(name), state } });
    }

    if (!city) {
      throw new InternalServerErrorException('Não foi possível resolver a cidade.');
    }

    return { id: city.id, name: city.name, state: city.state };
  }
}

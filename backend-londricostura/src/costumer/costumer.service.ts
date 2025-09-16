import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Costumer } from './entities/costumer.entity';
import { User } from 'src/user/entities/user.entity';
import { City } from 'src/city/entities/city.entity';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';

interface CostumerFilters {
  search?: string; // Busca geral
  name?: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
}

@Injectable()
export class CostumerService {
  constructor(
    @InjectRepository(Costumer)
    private readonly costumerRepository: Repository<Costumer>,
  ) { }

  async create(createCostumerDto: CreateCostumerDto, userId: number, cityId: number, neighborhood: string, street: string, number: number): Promise<Costumer> {
    const existingClient = await this.costumerRepository.findOne({
      where: {
        name: createCostumerDto.name,
      },
    });

    if (existingClient) {
      throw new ConflictException('Já existe um cliente cadastrado com este nome.');
    }

    const client = this.costumerRepository.create({
      name: createCostumerDto.name,
      phone: createCostumerDto.phone,
      user: { id: userId } as User,
      city: { id: cityId } as City,
      neighborhood: neighborhood,
      street: street,
      number: number
    });

    return this.costumerRepository.save(client);
  }

  async findAll(): Promise<Costumer[]> {
    return this.costumerRepository.find({ relations: ['user', 'city'] });
  }

  async findAllWithDeleteds(): Promise<Costumer[]> {
    return this.costumerRepository.find({ relations: ['user', 'city'], withDeleted: true });
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
    filters?: CostumerFilters,
  ): Promise<{ data: Costumer[]; total: number; page: number; limit: number; totalPages: number }> {
    const safePage = Number.isFinite(+page) && +page > 0 ? Math.floor(+page) : 1;
    const safeLimit = Number.isFinite(+limit) && +limit > 0 ? Math.min(Math.floor(+limit), 100) : 10;

    const makeBaseQb = () =>
      this.costumerRepository
        .createQueryBuilder('costumer')
        .leftJoinAndSelect('costumer.user', 'user')
        .leftJoinAndSelect('costumer.city', 'city');

    const applyFilters = (qb: ReturnType<typeof makeBaseQb>) => {
      if (!filters) return qb;

      // Busca geral - procura em nome, telefone e cidade
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.trim();
        const searchPattern = `${searchTerm}%`;
        
        qb.andWhere(
          `(
            LOWER(costumer.name) ILIKE LOWER(:searchPattern) OR
            REGEXP_REPLACE(costumer.phone, '[^0-9]', '', 'g') ILIKE :phonePattern OR
            LOWER(city.name) ILIKE LOWER(:searchPattern) OR
            LOWER(costumer.neighborhood) ILIKE LOWER(:searchPattern)
          )`,
          { 
            searchPattern,
            phonePattern: `%${searchTerm.replace(/\D/g, '')}%`
          }
        );
      } else {
        if (filters.name && filters.name.trim() !== '') {
          const namePattern = `%${filters.name.trim()}%`;
          qb.andWhere('LOWER(costumer.name) ILIKE LOWER(:namePattern)', { namePattern });
        }

        if (filters.phone && filters.phone.trim() !== '') {
          const phoneDigits = filters.phone.replace(/\D/g, '');
          qb.andWhere('REGEXP_REPLACE(costumer.phone, \'[^0-9]\', \'\', \'g\') ILIKE :phonePattern', { 
            phonePattern: `%${phoneDigits}%` 
          });
        }

        if (filters.city && filters.city.trim() !== '') {
          const cityPattern = `%${filters.city.trim()}%`;
          qb.andWhere('LOWER(city.name) ILIKE LOWER(:cityPattern)', { cityPattern });
        }

        if (filters.neighborhood && filters.neighborhood.trim() !== '') {
          const neighborhoodPattern = `%${filters.neighborhood.trim()}%`;
          qb.andWhere('LOWER(costumer.neighborhood) ILIKE LOWER(:neighborhoodPattern)', { neighborhoodPattern });
        }

        if (filters.street && filters.street.trim() !== '') {
          const streetPattern = `%${filters.street.trim()}%`;
          qb.andWhere('LOWER(costumer.street) ILIKE LOWER(:streetPattern)', { streetPattern });
        }
      }

      return qb;
    };

    // Conta o total
    const totalQb = applyFilters(makeBaseQb());
    const total = await totalQb.getCount();

    // Busca os dados com paginação
    const dataQb = applyFilters(makeBaseQb())
      .orderBy('costumer.name', 'ASC') // Ordenação por nome para melhor UX
      .addOrderBy('costumer.id', 'ASC') // Desempate por ID
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    const data = await dataQb.getMany();

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    return { data, total, page: safePage, limit: safeLimit, totalPages };
  }

  /**
   * Método auxiliar para busca rápida por termo geral (mantido para compatibilidade)
   */
  async searchByTerm(
    term: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Costumer[]; total: number; page: number; limit: number; totalPages: number }> {
    return this.findAllPaginated(page, limit, { search: term });
  }

  async findOne(id: number): Promise<Costumer> {
    const costumer = await this.costumerRepository.findOne({
      where: { id },
      relations: ['user', 'city'],
    });

    if (!costumer) {
      throw new NotFoundException(`Cliente com id ${id} não encontrado.`);
    }

    return costumer;
  }

  async update(id: number, updateCostumerDto: UpdateCostumerDto): Promise<Costumer> {
    const costumer = await this.costumerRepository.findOne({
      where: { id },
      relations: ['city', 'user'],
    });

    if (!costumer) {
      throw new NotFoundException(`Cliente com id ${id} não encontrado.`);
    }

    if (updateCostumerDto.name && updateCostumerDto.name !== costumer.name) {
      const exists = await this.costumerRepository.findOne({
        where: { name: updateCostumerDto.name }
      });
      if (exists) {
        throw new ConflictException('Já existe um cliente cadastrado com este nome.');
      }
    }

    if (updateCostumerDto.name) costumer.name = updateCostumerDto.name;
    if (updateCostumerDto.phone) costumer.phone = updateCostumerDto.phone;
    if (updateCostumerDto.city_id) costumer.city = { id: updateCostumerDto.city_id } as City;

    if (typeof updateCostumerDto.number === 'number') costumer.number = updateCostumerDto.number;
    if (updateCostumerDto.neighborhood) costumer.neighborhood = updateCostumerDto.neighborhood;
    if (updateCostumerDto.street) costumer.street = updateCostumerDto.street;

    await this.costumerRepository.save(costumer);

    const updated = await this.costumerRepository.findOne({
      where: { id },
      relations: ['city', 'user'],
    });

    if (!updated) {
      throw new NotFoundException(`Cliente com id ${id} não encontrado após atualização.`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.costumerRepository.softDelete(id);
  }
}
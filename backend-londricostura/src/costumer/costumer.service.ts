import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Costumer } from './entities/costumer.entity';
import { User } from 'src/user/entities/user.entity';
import { City } from 'src/city/entities/city.entity';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';

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
      number: number,
    });
    
    return this.costumerRepository.save(client);
  }

  async findAll(): Promise<Costumer[]> {
    return this.costumerRepository.find({ relations: ['user', 'city'] }); // por padrão ele já busca sem os deletados.
  }

  async findAllWithDeleteds(): Promise<Costumer[]> {
    return this.costumerRepository.find({ relations: ['user', 'city'], withDeleted: true });
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
    filterField?: keyof Costumer,   // 'id' | 'name' | 'phone'
    filterValue?: string,
  ): Promise<{ data: Costumer[]; total: number; page: number; limit: number; totalPages: number }> {
    const safePage = Number.isFinite(+page) && +page > 0 ? Math.floor(+page) : 1;
    const safeLimit = Number.isFinite(+limit) && +limit > 0 ? Math.min(Math.floor(+limit), 100) : 10;

    const makeBaseQb = () =>
      this.costumerRepository
        .createQueryBuilder('costumer')
        .leftJoinAndSelect('costumer.user', 'user')
        .leftJoinAndSelect('costumer.city', 'city');

    const applyFilter = (qb: ReturnType<typeof makeBaseQb>) => {
      if (filterField && typeof filterValue === 'string' && filterValue.trim() !== '') {
        const v = filterValue.trim();

        if (filterField === 'id') {
          const idNum = Number(v);
          if (!Number.isNaN(idNum)) {
            qb.andWhere('costumer.id = :id', { id: idNum });
          } else {
            qb.andWhere('CAST(costumer.id AS TEXT) ILIKE :value', { value: `%${v}%` });
          }
        } else if (filterField === 'name') {
          qb.andWhere('costumer.name ILIKE :value', { value: `%${v}%` });
        } else if (filterField === 'phone') {
          qb.andWhere('costumer.phone ILIKE :value', { value: `%${v}%` });
        }
      }
      return qb;
    };

    const totalQb = applyFilter(makeBaseQb());
    const total = await totalQb.getCount();

    const dataQb = applyFilter(makeBaseQb())
      .orderBy('costumer.id', 'ASC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    const data = await dataQb.getMany();

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    return { data, total, page: safePage, limit: safeLimit, totalPages };
  }

  async findOne(id: number): Promise<Costumer> {
    const costumer = await this.costumerRepository.findOne({
      where: { id },
      relations: ['user', 'city']
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
      const clientWithSameName = await this.costumerRepository.findOne({
        where: { name: updateCostumerDto.name }
      });

      if (clientWithSameName) {
        throw new ConflictException('Já existe um produto cliente cadastrado com este nome.');
      }
    }

    if (updateCostumerDto.name) {
      costumer.name = updateCostumerDto.name;
    }

    if (updateCostumerDto.phone) {
      costumer.phone = updateCostumerDto.phone;
    }

    if (updateCostumerDto.city_id) {
      costumer.city = { id: updateCostumerDto.city_id } as City;
    }

    await this.costumerRepository.save(costumer);

    const updatedCostumer = await this.costumerRepository.findOne({
      where: { id },
      relations: ['city', 'user'],
    });

    if (!updatedCostumer) {
      throw new NotFoundException(`Cliente com id ${id} não encontrado após atualização.`);
    }

    return updatedCostumer;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.costumerRepository.softDelete(id);
  }
}
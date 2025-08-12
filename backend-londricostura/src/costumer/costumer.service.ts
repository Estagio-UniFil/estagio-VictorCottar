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

  async create(createCostumerDto: CreateCostumerDto, userId: number, cityId: number): Promise<Costumer> {
    const existingClient = await this.costumerRepository.findOne({
      where: {
        name: createCostumerDto.name,
      },
    });

    if (existingClient) {
      throw new ConflictException('Já existe um cliente cadastrado com este nome.');
    }

    // associa ao usuário recebido via token
    const client = this.costumerRepository.create({
      name: createCostumerDto.name,
      phone: createCostumerDto.phone,
      user: { id: userId } as User,
      city: { id: cityId } as City,
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
    page: number,
    limit: number,
    filterField?: keyof Costumer,
    filterValue?: string,
  ): Promise<{ data: Costumer[]; total: number; page: number; limit: number }> {
    const query = this.costumerRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.city', 'city')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.id', 'ASC');

    if (filterField && filterValue) {
      query.andWhere(`product.${filterField} ILIKE :value`, { value: `%${filterValue}%` });
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
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
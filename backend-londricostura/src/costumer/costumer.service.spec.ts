import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CostumerService } from './costumer.service';
import { Costumer } from './entities/costumer.entity';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { User } from 'src/user/entities/user.entity';
import { City } from 'src/city/entities/city.entity';

type MockRepository<T = any> = {
  findOne: jest.Mock;
  find: jest.Mock;
  createQueryBuilder: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  softDelete: jest.Mock;
};

describe('CostumerService', () => {
  let service: CostumerService;
  let repository: MockRepository<Costumer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostumerService,
        {
          provide: getRepositoryToken(Costumer),
          useFactory: (): MockRepository<Costumer> => ({
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<CostumerService>(CostumerService);
    repository = module.get<MockRepository<Costumer>>(getRepositoryToken(Costumer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll() e findAllWithDeleteds()', () => {
    it('findAll deve retornar lista sem deletados', async () => {
      const listFake = [{ id: 1, name: 'A', user: { id: 1 }, city: { id: 1 } }] as Costumer[];
      repository.find.mockResolvedValue(listFake);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ relations: ['user', 'city'] });
      expect(result).toBe(listFake);
    });

    it('findAllWithDeleteds deve retornar lista incluindo deletados', async () => {
      const listFake = [{ id: 2, name: 'B', user: { id: 1 }, city: { id: 1 }, deletedAt: new Date() }] as Costumer[];
      repository.find.mockResolvedValue(listFake);

      const result = await service.findAllWithDeleteds();

      expect(repository.find).toHaveBeenCalledWith({ relations: ['user', 'city'], withDeleted: true });
      expect(result).toBe(listFake);
    });
  });

  describe('findOne()', () => {
    it('deve retornar cliente quando encontrado', async () => {
      const fake = { id: 10, name: 'X', user: { id: 2 }, city: { id: 3 } } as Costumer;
      repository.findOne.mockResolvedValue(fake);

      const result = await service.findOne(10);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 10 }, relations: ['user', 'city'] });
      expect(result).toBe(fake);
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Cliente com id 999 não encontrado.');
    });
  });

  describe('remove()', () => {
    it('deve chamar softDelete quando cliente existir', async () => {
      const fake = { id: 7, name: 'Del', user: { id: 1 }, city: { id: 1 } } as Costumer;
      repository.findOne.mockResolvedValue(fake);
      repository.softDelete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(7);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 7 }, relations: ['user', 'city'] });
      expect(repository.softDelete).toHaveBeenCalledWith(7);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});

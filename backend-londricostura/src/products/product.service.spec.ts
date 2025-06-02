import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/user/entities/user.entity';

type MockRepository<T = any> = {
  findOne: jest.Mock;
  find: jest.Mock;
  findAndCount: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  softDelete: jest.Mock;
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: (): MockRepository<Product> => ({
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<MockRepository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const dto: CreateProductDto = {
      name: 'Produto Teste',
      code: 'CODE123',
      price: 99.9,
    };
    const userId = 7;

    it('deve criar um produto quando não houver conflitos', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((payload) => payload as any);
      const savedProduct = { id: 1, ...dto, user: { id: userId } } as Product;
      repository.save.mockResolvedValue(savedProduct);

      const result = await service.create(dto, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: [
          { code: dto.code },
          { name: dto.name },
        ],
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        user: { id: userId } as User,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(savedProduct);
    });

    it('deve lançar ConflictException se já existir produto com mesmo código', async () => {
      const existing = {
        id: 2,
        code: dto.code,
        name: 'Outro',
        price: 10,
        user: { id: 1 }
      } as Product;
      repository.findOne.mockResolvedValue(existing);

      await expect(service.create(dto, userId)).rejects.toThrow(ConflictException);
      await expect(service.create(dto, userId)).rejects.toThrow('Já existe um produto cadastrado com este código.');
      expect(repository.findOne).toHaveBeenCalledTimes(2); // Called twice due to two expect calls
    });

    it('deve lançar ConflictException se já existir produto com mesmo nome', async () => {
      const existing = {
        id: 3,
        code: 'DIFFCODE',
        name: dto.name,
        price: 20,
        user: { id: 1 }
      } as Product;
      repository.findOne.mockResolvedValue(existing);

      const dto2 = { ...dto, code: 'NOVOCOD' };
      await expect(service.create(dto2, userId)).rejects.toThrow(ConflictException);
      await expect(service.create(dto2, userId)).rejects.toThrow('Já existe um produto cadastrado com este nome.');
    });
  });

  describe('findAll() e findAllWithDeleteds()', () => {
    it('findAll deve retornar lista de produtos sem deletados', async () => {
      const listFake = [
        {
          id: 1,
          name: 'A',
          code: 'A1',
          price: 10,
          user: { id: 1, name: 'User' }
        }
      ] as Product[];
      repository.find.mockResolvedValue(listFake);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toBe(listFake);
    });

    it('findAllWithDeleteds deve retornar lista incluindo deletados', async () => {
      const listFake = [
        {
          id: 2,
          name: 'B',
          code: 'B1',
          price: 20,
          user: { id: 1, name: 'User' },
          deletedAt: new Date()
        }
      ] as Product[];
      repository.find.mockResolvedValue(listFake);

      const result = await service.findAllWithDeleteds();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['user'],
        withDeleted: true
      });
      expect(result).toBe(listFake);
    });
  });

  describe('findAllPaginated()', () => {
    it('deve ajustar page e limit e retornar resultado paginado', async () => {
      const mockData = [{ id: 1 } as Product];
      const mockTotal = 10;
      repository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await service.findAllPaginated(-1, 500);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['user'],
        skip: 0,    // (page 1 - 1) * 100
        take: 100,  // limite ajustado para 100
        order: { id: 'ASC' },
      });
      expect(result).toEqual({
        data: mockData,
        total: mockTotal,
        page: 1,
        limit: 100
      });
    });

    it('deve usar page e limit fornecidos quando válidos', async () => {
      const mockData = [{ id: 2 } as Product, { id: 3 } as Product];
      const mockTotal = 2;
      repository.findAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await service.findAllPaginated(2, 5);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['user'],
        skip: (2 - 1) * 5,
        take: 5,
        order: { id: 'ASC' },
      });
      expect(result).toEqual({
        data: mockData,
        total: mockTotal,
        page: 2,
        limit: 5
      });
    });
  });

  describe('findOne()', () => {
    it('deve retornar produto quando encontrado', async () => {
      const fake = {
        id: 10,
        name: 'X',
        code: 'X10',
        price: 5,
        user: { id: 2, name: 'User' }
      } as Product;
      repository.findOne.mockResolvedValue(fake);

      const result = await service.findOne(10);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 10 },
        relations: ['user'],
      });
      expect(result).toBe(fake);
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Produto com id 999 não encontrado.');
    });
  });

  describe('update()', () => {
    const existing: Product = {
      id: 5,
      name: 'Original',
      code: 'C001',
      price: 15,
      user: { id: 2, name: 'User' } as User,
    } as Product;

    it('deve atualizar sem conflito de código ou nome', async () => {
      // Mock para o findOne interno do update
      repository.findOne.mockResolvedValueOnce(existing);
      // Mock para verificação de código (não existe conflito)
      repository.findOne.mockResolvedValueOnce(null);
      // Mock para verificação de nome (não existe conflito)
      repository.findOne.mockResolvedValueOnce(null);

      const dto: UpdateProductDto = { name: 'Novo Nome', price: 20 };
      const merged = { ...existing, ...dto } as Product;
      repository.save.mockResolvedValue(merged);

      const result = await service.update(5, dto);

      expect(repository.findOne).toHaveBeenCalledTimes(2); // findOne + verificação de nome
      expect(repository.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: 5 },
        relations: ['user'],
      });
      expect(repository.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });

  });

  describe('remove()', () => {
    it('deve chamar softDelete quando produto existir', async () => {
      const fake = {
        id: 7,
        name: 'Del',
        code: 'D7',
        price: 1,
        user: { id: 1 }
      } as Product;
      repository.findOne.mockResolvedValue(fake);
      repository.softDelete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(7);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 7 },
        relations: ['user'],
      });
      expect(repository.softDelete).toHaveBeenCalledWith(7);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});
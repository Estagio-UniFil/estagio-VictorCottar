import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

// Define o mock do Repository para entidades que são objetos literais
type MockRepo<T extends object> = jest.Mocked<Repository<T>>;

// Cria um repositório mock, fazendo cast via unknown para satisfazer TS
const createMockRepo = <T extends object>(): MockRepo<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
} as unknown as MockRepo<T>);

describe('CityService', () => {
  let service: CityService;
  let repo: MockRepo<City>;

  beforeEach(() => {
    repo = createMockRepo<City>();
    service = new CityService(repo);
  });

  describe('create()', () => {
    const dto: CreateCityDto = { name: 'São Paulo', state: 'SP' };

    it('deve criar quando não houver conflito', async () => {
      repo.findOne
        .mockResolvedValueOnce(null) // checa nome
        .mockResolvedValueOnce(null); // checa nome+estado
      repo.save.mockResolvedValue({ id: 1, ...dto } as City);

      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('deve lançar ConflictException se o nome já existir', async () => {
      repo.findOne.mockResolvedValueOnce({ id: 1, ...dto } as City);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('deve lançar ConflictException se a cidade já existir no estado', async () => {
      repo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 2, ...dto } as City);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll()', () => {
    it('deve retornar todas as cidades', async () => {
      const cities = [{ id: 1, name: 'Campinas', state: 'SP' }] as City[];
      repo.find.mockResolvedValue(cities);
      const result = await service.findAll();
      expect(result).toEqual(cities);
    });
  });

  describe('findOne()', () => {
    it('deve retornar a cidade quando encontrada', async () => {
      const city = { id: 1, name: 'Campinas', state: 'SP' } as City;
      repo.findOne.mockResolvedValue(city);
      const result = await service.findOne(1);
      expect(result).toEqual(city);
    });

    it('deve lançar NotFoundException se não encontrada', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    const existing = { id: 1, name: 'Campinas', state: 'SP' } as City;
    const dto: UpdateCityDto = { name: 'Campinas Nova' };

    it('deve atualizar com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({ ...existing, ...dto } as City);

      const result = await service.update(1, dto);
      expect(repo.save).toHaveBeenCalledWith({ ...existing, ...dto });
      expect(result).toEqual({ ...existing, ...dto });
    });
  });


  describe('remove()', () => {
    it('deve deletar quando existir', async () => {
      const city = { id: 1, name: 'Campinas', state: 'SP' } as City;
      jest.spyOn(service, 'findOne').mockResolvedValue(city);
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

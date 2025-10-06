import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateCostumerDto } from './create-costumer.dto';
import { UpdateCostumerDto } from './update-costumer.dto';

describe('Validação de DTO de Cliente', () => {
  describe('CreateCostumerDto', () => {
    it('deve validar um DTO válido', () => {
      const dto = plainToInstance(CreateCostumerDto, {
        name: 'Cliente Teste',
        phone: '11987654321',
        city_id: 1,
        neighborhood: 'Centro',
        street: 'Rua Principal',
        number: 123,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar sem nome', () => {
      const dto = plainToInstance(CreateCostumerDto, {
        phone: '11987654321',
        city_id: 1,
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);
    });

    it('deve falhar com telefone em formato inválido', () => {
      const dto = plainToInstance(CreateCostumerDto, {
        name: 'Cliente',
        phone: '12345',
        city_id: 1,
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'phone')).toBe(true);
    });

    it('deve falhar sem city_id', () => {
      const dto = plainToInstance(CreateCostumerDto, {
        name: 'Cliente',
        phone: '11987654321',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'city_id')).toBe(true);
    });
  });

  describe('UpdateCostumerDto', () => {
    it('deve validar apenas o telefone quando em formato correto', () => {
      const dto = plainToInstance(UpdateCostumerDto, { phone: '11987654321', cep: '12345678' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar quando telefone em formato incorreto', () => {
      const dto = plainToInstance(UpdateCostumerDto, { phone: 'abc123' } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'phone')).toBe(true);
    });

    it('deve validar city_id quando fornecido', () => {
      const dto = plainToInstance(UpdateCostumerDto, { city_id: 2, cep: '12345678' } as any);
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });
  });
});

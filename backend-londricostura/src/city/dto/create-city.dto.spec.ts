import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateCityDto } from './create-city.dto';

describe('Validação do CreateCityDto', () => {
  it('deve validar um DTO válido', () => {
    const dto = plainToInstance(CreateCityDto, { name: 'Campinas', state: 'SP' });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('deve falhar sem o nome', () => {
    const dto = plainToInstance(CreateCityDto, { state: 'SP' } as any);
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('deve falhar com nome maior que 30 caracteres', () => {
    const longName = 'a'.repeat(31);
    const dto = plainToInstance(CreateCityDto, { name: longName, state: 'SP' });
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('deve falhar sem o estado', () => {
    const dto = plainToInstance(CreateCityDto, { name: 'Campinas' } as any);
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'state')).toBe(true);
  });

  it('deve falhar com sigla de estado inválida', () => {
    const dto = plainToInstance(CreateCityDto, { name: 'Campinas', state: 'XX' });
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'state')).toBe(true);
  });

  it('deve falhar com sigla de estado maior que 2 caracteres', () => {
    const dto = plainToInstance(CreateCityDto, { name: 'Campinas', state: 'SPX' } as any);
    const errors = validateSync(dto);
    expect(errors.some(e => e.property === 'state')).toBe(true);
  });
});

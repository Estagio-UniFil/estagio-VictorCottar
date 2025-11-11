import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';

import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { ProductResponseDto } from './product-response.dto';

describe('DTO Validation', () => {
  describe('CreateProductDto', () => {
    it('deve validar um DTO válido (campos corretos)', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Produto Exemplo',
        code: 'PRD-001',
        price: 123.45,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(typeof dto.price).toBe('number');
      expect(dto.price).toBe(123.45);
    });

    it('deve converter string com vírgula em número (price)', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Produto Vírgula',
        code: 'PRD-002',
        price: '12,34',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(typeof dto.price).toBe('number');
      expect(dto.price).toBeCloseTo(12.34);
    });

    it('deve falhar se faltar name', async () => {
      const dto = plainToInstance(CreateProductDto, {
        code: 'PRD-003',
        price: 10,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);

      const nameError = errors.find(e => e.property === 'name');
      expect(nameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se faltar code', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Sem Código',
        price: 10,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'code')).toBe(true);

      const codeError = errors.find(e => e.property === 'code');
      expect(codeError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se faltar price', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Sem Preço',
        code: 'PRD-004',
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'price')).toBe(true);

      const priceError = errors.find(e => e.property === 'price');
      expect(priceError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se price for menor que 0.01', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Preço Inválido',
        code: 'PRD-005',
        price: 0,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'price')).toBe(true);

      const priceError = errors.find(e => e.property === 'price');
      expect(priceError?.constraints).toHaveProperty('min');
    });

    it('deve falhar se name for vazio', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: '',
        code: 'PRD-006',
        price: 5,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);

      const nameError = errors.find(e => e.property === 'name');
      expect(nameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se code for vazio', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Nome Válido',
        code: '',
        price: 5,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'code')).toBe(true);

      const codeError = errors.find(e => e.property === 'code');
      expect(codeError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se price for string não numérica', async () => {
      const dto = plainToInstance(CreateProductDto, {
        name: 'Nome Válido',
        code: 'CODE-123',
        price: 'abc' as any,
      });

      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'price')).toBe(true);

      const priceError = errors.find(e => e.property === 'price');
      expect(priceError?.constraints).toHaveProperty('isNumber');
    });
  });

  describe('UpdateProductDto', () => {
    it('deve validar se passar apenas name', async () => {
      const dto = plainToInstance(UpdateProductDto, { name: 'Novo Nome' });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve validar se passar apenas code', async () => {
      const dto = plainToInstance(UpdateProductDto, { code: 'NOVOCOD' });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve validar se passar apenas price', async () => {
      const dto = plainToInstance(UpdateProductDto, { price: 55.5 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve converter string com vírgula em número quando price estiver no Update', async () => {
      const dto = plainToInstance(UpdateProductDto, { price: '7,89' });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(typeof dto.price).toBe('number');
      expect(dto.price).toBeCloseTo(7.89);
    });

    it('deve falhar se price fornecido for menor que 0.01', async () => {
      const dto = plainToInstance(UpdateProductDto, { price: 0 });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'price')).toBe(true);

      const priceError = errors.find(e => e.property === 'price');
      expect(priceError?.constraints).toHaveProperty('min');
    });

    it('não deve falhar se nenhum campo for passado (todos opcionais)', async () => {
      const dto = plainToInstance(UpdateProductDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar se passar price não numérico', async () => {
      const dto = plainToInstance(UpdateProductDto, { price: 'abc' as any });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'price')).toBe(true);

      const priceError = errors.find(e => e.property === 'price');
      expect(priceError?.constraints).toHaveProperty('isNumber');
    });

    it('deve falhar se name for vazio (quando fornecido)', async () => {
      const dto = plainToInstance(UpdateProductDto, { name: '' });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);

      const nameError = errors.find(e => e.property === 'name');
      expect(nameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve falhar se code for vazio (quando fornecido)', async () => {
      const dto = plainToInstance(UpdateProductDto, { code: '' });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'code')).toBe(true);

      const codeError = errors.find(e => e.property === 'code');
      expect(codeError?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('ProductResponseDto', () => {
    it('deve transformar plain object em ProductResponseDto', () => {
      const plain = {
        id: 15,
        name: 'Resposta Test',
        code: 'RST-15',
        price: 99,
        user: { id: 3, name: 'Usuário Teste', extra: 'campoExtra' },
        user_id: 3,
        deletedAt: null,
        outroCampo: 'deve ser ignorado',
      };

      const instance = plainToInstance(ProductResponseDto, plain, {
        excludeExtraneousValues: true,
      });

      expect(instance).toBeInstanceOf(ProductResponseDto);
      expect(instance.id).toBe(15);
      expect(instance.name).toBe('Resposta Test');
      expect(instance.code).toBe('RST-15');
      expect(instance.price).toBe(99);

      // Verifica transformação em UserMinimal
      expect(instance.user).toBeDefined();
      expect(instance.user.id).toBe(3);
      expect(instance.user.name).toBe('Usuário Teste');
      expect((instance.user as any).extra).toBeUndefined();

      expect(instance.user_id).toBe(3);
      expect(instance.deletedAt).toBeNull();

      // Campo não exposto não deve estar na instância
      expect((instance as any).outroCampo).toBeUndefined();
    });

    it('deve converter deletedAt em Date quando for string ISO', () => {
      const plain = {
        id: 20,
        name: 'Teste Data',
        code: 'TD-20',
        price: 10,
        user: { id: 5, name: 'Alice' },
        user_id: 5,
        deletedAt: '2025-05-20T10:00:00Z',
      };

      const instance = plainToInstance(ProductResponseDto, plain, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      // Aplica transformação pós-conversão
      if (instance.deletedAt && typeof instance.deletedAt === 'string') {
        instance.deletedAt = new Date(instance.deletedAt);
      }

      expect(instance.deletedAt).toEqual(new Date('2025-05-20T10:00:00Z'));
      expect(instance.deletedAt).toBeInstanceOf(Date);
    });

    it('deve manter deletedAt como null quando for null', () => {
      const plain = {
        id: 21,
        name: 'Teste Null',
        code: 'TN-21',
        price: 15,
        user: { id: 6, name: 'Bob' },
        user_id: 6,
        deletedAt: null,
      };

      const instance = plainToInstance(ProductResponseDto, plain, {
        excludeExtraneousValues: true,
      });

      expect(instance.deletedAt).toBeNull();
    });
  });
});
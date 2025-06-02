import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

describe('DTO Validation', () => {
  describe('CreateUserDto', () => {
    it('deve validar um DTO válido', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Victor',
        email: 'victor@example.com',
        password: '1234',
        active: false,
        admin: true,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar sem name', () => {
      const dto = plainToInstance(CreateUserDto, {
        email: 'v@e.com',
        password: '1234',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);
    });

    it('deve falhar com email inválido', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Foo',
        email: 'invalido',
        password: '1234',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'email')).toBe(true);
    });

    it('deve falhar com senha curta', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Foo',
        email: 'foo@bar.com',
        password: '123',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'password')).toBe(true);
    });

    it('deve falhar com active não boolean', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Foo',
        email: 'foo@bar.com',
        password: '1234',
        active: 'sim',
      } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'active')).toBe(true);
    });

    it('deve falhar com admin não boolean', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Foo',
        email: 'foo@bar.com',
        password: '1234',
        admin: 'sim',
      } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'admin')).toBe(true);
    });

    it('deve falhar com name vazio', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: '',
        email: 'foo@bar.com',
        password: '1234',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'name')).toBe(true);
    });

    it('deve falhar com email vazio', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'Foo',
        email: '',
        password: '1234',
      });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'email')).toBe(true);
    });

    it('deve aceitar caracteres especiais em name', () => {
      const dto = plainToInstance(CreateUserDto, {
        name: 'João Silva',
        email: 'joao@silva.com',
        password: '1234',
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateUserDto', () => {
    it('deve validar se só passar name', () => {
      const dto = plainToInstance(UpdateUserDto, { name: 'Novo Nome' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar se password for muito curto', () => {
      const dto = plainToInstance(UpdateUserDto, { password: '123' });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'password')).toBe(true);
    });

    it('deve validar active e admin opcionais e booleanos', () => {
      const dto = plainToInstance(UpdateUserDto, {
        active: true,
        admin: false,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar se admin não for booleano', () => {
      const dto = plainToInstance(UpdateUserDto, { admin: 'yes' } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'admin')).toBe(true);
    });

    it('deve falhar se active não for booleano', () => {
      const dto = plainToInstance(UpdateUserDto, { active: 'yes' } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'active')).toBe(true);
    });

    it('deve aceitar caracteres especiais em name', () => {
      const dto = plainToInstance(UpdateUserDto, { name: 'João Silva' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve aceitar email opcional mas válido quando fornecido', () => {
      const dto = plainToInstance(UpdateUserDto, { email: 'joao@silva.com' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar com email inválido quando fornecido', () => {
      const dto = plainToInstance(UpdateUserDto, { email: 'invalido' });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'email')).toBe(true);
    });

    it('deve aceitar senha opcional mas válida quando fornecida', () => {
      const dto = plainToInstance(UpdateUserDto, { password: '123456' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateUserDto', () => {
    it('deve validar se só passar name', () => {
      const dto = plainToInstance(UpdateUserDto, { name: 'Novo Nome' });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar se password for muito curto', () => {
      const dto = plainToInstance(UpdateUserDto, { password: '123' });
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'password')).toBe(true);
    });

    it('deve validar active e admin opcionais e booleanos', () => {
      const dto = plainToInstance(UpdateUserDto, {
        active: true,
        admin: false,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar se admin não for booleano', () => {
      const dto = plainToInstance(UpdateUserDto, { admin: 'yes' } as any);
      const errors = validateSync(dto);
      expect(errors.some(e => e.property === 'admin')).toBe(true);
    });
  });
});

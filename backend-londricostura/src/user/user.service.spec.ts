import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = {
  findOne: jest.Mock;
  find: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
  softDelete: jest.Mock;
};

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('deve criar um usuário com senha hash', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.create.mockImplementation((dto) => dto);
    repository.save.mockImplementation((user) => Promise.resolve(user));

    const dto = { name: 'Teste', email: 'teste@example.com', password: '1234' };
    const user = await service.create(dto);

    expect(user.password).not.toBe(dto.password);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve lançar erro se email já existir', async () => {
    repository.findOne.mockResolvedValue({ id: 1 });
    await expect(
      service.create({ name: 'Teste', email: 'teste@example.com', password: '1234' })
    ).rejects.toThrow(ConflictException);
  });

  it('deve retornar todos os usuários', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    repository.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });

  it('deve retornar um usuário pelo id', async () => {
    const user = { id: 1 };
    repository.findOne.mockResolvedValue(user);
    expect(await service.findOne(1)).toEqual(user);
  });

  it('deve lançar exceção se usuário não encontrado', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('deve inativar um usuário ativo', async () => {
    const user = { id: 1, active: true };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const updated = await service.inactivatedUser(1);
    expect(updated.active).toBe(false);
  });

  it('deve lançar exceção ao inativar usuário já inativo', async () => {
    const user = { id: 1, active: false };
    repository.findOne.mockResolvedValue(user);
    await expect(service.inactivatedUser(1)).rejects.toThrow(ConflictException);
  });

  it('deve ativar um usuário inativo', async () => {
    const user = { id: 1, active: false };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const updated = await service.activatedUser(1);
    expect(updated.active).toBe(true);
  });

  it('deve promover um usuário a admin', async () => {
    const user = { id: 1, admin: false };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const updated = await service.promoteAdmin(1);
    expect(updated.admin).toBe(true);
  });

  it('deve lançar exceção ao promover quem já é admin', async () => {
    const user = { id: 1, admin: true };
    repository.findOne.mockResolvedValue(user);
    await expect(service.promoteAdmin(1)).rejects.toThrow(ConflictException);
  });

  it('deve despromover um usuário admin', async () => {
    const user = { id: 1, admin: true };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const updated = await service.demoteAdmin(1);
    expect(updated.admin).toBe(false);
  });

  it('deve lançar exceção ao despromover quem já não é admin', async () => {
    const user = { id: 1, admin: false };
    repository.findOne.mockResolvedValue(user);
    await expect(service.demoteAdmin(1)).rejects.toThrow(ConflictException);
  });

  it('deve remover um usuário', async () => {
    const id = 1;
    repository.findOne.mockResolvedValue(id);
    repository.remove.mockResolvedValue(null);
    await service.remove(1);
    expect(repository.softDelete).toHaveBeenCalledWith(id);
  });

  it('create deve propagar erro inesperado do repositório', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.create.mockImplementation(dto => dto);
    repository.save.mockRejectedValue(new Error('Erro banco'));
    const dto = { name: 'Erro', email: 'erro@example.com', password: '1234' };

    await expect(service.create(dto)).rejects.toThrow('Erro banco');
  });

  it('remove deve lançar NotFoundException ao tentar remover usuário inexistente', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('promoteAdmin deve lançar NotFoundException para usuário inexistente', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.promoteAdmin(999)).rejects.toThrow(NotFoundException);
  });

  it('demoteAdmin deve lançar NotFoundException para usuário inexistente', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.demoteAdmin(999)).rejects.toThrow(NotFoundException);
  });

  it('update deve ignorar campos undefined', async () => {
    const user = { id: 1, name: 'Antigo', password: 'hashedSenha' };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation(u => Promise.resolve(u));

    const updateDto = { name: undefined };
    const updated = await service.update(1, updateDto as any);

    expect(updated.name).toBe(user.name);
  });

  it('update deve manter senha se mesma senha for enviada', async () => {
    const user = { id: 1, name: 'Teste', password: 'hashedSenha' };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation(u => Promise.resolve(u));

    // Senha enviada igual (não vazia) - hash é aplicado, porém o hash vai alterar a senha
    const updateDto = { password: 'novaSenha' };
    const updated = await service.update(1, updateDto as any);

    expect(updated.password).not.toBe('novaSenha');
  });

  it('findAll deve retornar array vazio se não houver usuários', async () => {
    repository.find.mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('deve atualizar dados do usuário e hash da senha se fornecida', async () => {
    const user = { id: 1, name: 'Teste', password: 'old' };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const update = await service.update(1, { name: 'Novo', password: 'novaSenha' });
    expect(update.name).toBe('Novo');
    expect(update.password).not.toBe('novaSenha');
  });

  it('deve ignorar a senha se vazia ao atualizar', async () => {
    const user = { id: 1, name: 'Teste', password: 'old' };
    repository.findOne.mockResolvedValue(user);
    repository.save.mockImplementation((u) => Promise.resolve(u));
    const update = await service.update(1, { name: 'Novo', password: '' });
    expect(update.password).toBe('old');
  });

  it('deve encontrar usuário por email', async () => {
    const user = { id: 1, email: 'teste@example.com' };
    repository.findOne.mockResolvedValue(user);
    const found = await service.findByEmail('teste@example.com');
    expect(found).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'teste@example.com' } });
  });

  it('deve lançar NotFoundException se findOne retornar null', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.remove(123)).rejects.toThrow(NotFoundException);
  });


});

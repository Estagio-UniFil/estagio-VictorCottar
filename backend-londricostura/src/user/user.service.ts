import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async onModuleInit() {
    await this.createAdminUser();
  }

  /**
   * Criação do usuário admin caso não exista
   */
  private async createAdminUser() {
    const adminEmail = 'admin';
    const existingAdmin = await this.findByEmail(adminEmail);

    if (!existingAdmin) {
      const adminData = {
        name: 'admin',
        email: adminEmail,
        password: 'admin',
        admin: true,
      };

      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const admin = this.userRepository.create({
        ...adminData,
        password: hashedPassword,
      });

      await this.userRepository.save(admin);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Esse email já está cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }
    return user;
  }

  async inactivatedUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.active = false;
    return this.userRepository.save(user);
  }

  async activatedUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.active = true;
    return this.userRepository.save(user);
  }

  async promoteAdmin(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.admin = true;
    return this.userRepository.save(user);
  }

  async demoteAdmin(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.admin = false;
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Se a senha for fornecida e não estiver vazia, faz o hash
    if (updateUserDto.password && updateUserDto.password !== '') {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    } else if (updateUserDto.password === '') {
      // Remove o campo password se estiver vazio
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
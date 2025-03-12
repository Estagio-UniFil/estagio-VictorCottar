import { Injectable, NotFoundException } from '@nestjs/common';
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

  private async createAdminUser() {
    const adminEmail = 'admin';
    const existingAdmin = await this.findByEmail(adminEmail);

    if (!existingAdmin) {
      const adminData = {
        name: 'admin',
        email: adminEmail,
        password: 'admin',
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
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  async inactivatedUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    user.active = false;
    return this.userRepository.save(user);
  }

  async activatedUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    user.active = true;
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    await this.userRepository.remove(user);
  }
}
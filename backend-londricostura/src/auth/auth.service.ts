import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use.');
    }

    return this.userService.create({ name, email, password });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found.');
    }

    if (!user.active) {
      throw new UnauthorizedException('User account is inactive.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password.');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
      admin: user.admin
    };

    return {
      access_token: this.jwtService.sign(payload),
      userName: user.name,
      userAdmin: user.admin
    };
  }
}

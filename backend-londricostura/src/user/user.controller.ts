import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'Usuário criado com sucesso.',
      data: user,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const users = await this.userService.findAll();
    return {
      message: 'Usuários encontrados com sucesso.',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      message: 'Usuário encontrado com sucesso.',
      data: user,
    };
  }

  @Put('/inactivate/:id')
  @UseGuards(AuthGuard('jwt'))
  async inactivatedUser(@Param('id') id: string) {
    const inactivateUser = await this.userService.inactivatedUser(Number(+id));
    return {
      message: 'Usuário inativado com sucesso.',
      data: inactivateUser,
    };
  }

  @Put('/activate/:id')
  @UseGuards(AuthGuard('jwt'))
  async activedUser(@Param('id') id: string) {
    const activeUser = await this.userService.activatedUser(Number(+id));
    return {
      message: 'Usuário ativado com sucesso.',
      data: activeUser,
    };
  }

  @Put('/promote/:id')
  @UseGuards(AuthGuard('jwt'))
  async promoteAdmin(@Param('id') id: string) {
    const promoteAdmin = await this.userService.promoteAdmin(Number(+id));
    return {
      message: 'Usuário promovido com sucesso para administrador.',
      data: promoteAdmin,
    };
  }

  @Put('/demote/:id')
  @UseGuards(AuthGuard('jwt'))
  async demoteAdmin(@Param('id') id: string) {
    const demoteAdmin = await this.userService.demoteAdmin(Number(+id));
    return {
      message: 'Usuário removido com sucesso de administrador.',
      data: demoteAdmin,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    return {
      message: 'Usuário atualizado com sucesso.',
      data: updatedUser,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      message: 'Usuário removido com sucesso.',
    };
  }
}
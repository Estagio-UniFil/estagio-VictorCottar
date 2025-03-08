import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
      message: 'User successfully created.',
      data: user,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const users = await this.userService.findAll();
    return {
      message: 'Users retrieved successfully.',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      message: 'User retrieved successfully.',
      data: user,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    return {
      message: 'User successfully updated.',
      data: updatedUser,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      message: 'User successfully removed.',
    };
  }
}
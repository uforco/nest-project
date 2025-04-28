import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('auth/user')
// @UseGuards(new RolesGuard(['ADMIN']))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('signin')
  @HttpCode(200)
  signIn(@Body() createUserDto: CreateUserDto) {
    return this.userService.signIn(createUserDto);
  }

  @Get()
  @UseGuards(new RolesGuard(['ADMIN']))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Get()
  async read(@Req() req) {
    return this.userService.findAll();
  }

  @Get(':id')
  async readById(@Param('id', ParseIntPipe) id) {
    return this.userService.getById(id);
  }

  @Put(':id')
  async updade(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    if (!(await this.readById(id))) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.userService.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(datas: CreateUserDTO) {
    datas.password = await bcrypt.hash(datas.password, 10);
    const user = await this.prisma.user.create({ data: datas });
    delete user.password;
    return { message: 'User created', user };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.prisma.user.update({
      data: data,
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async cretateToken(user: User) {
    delete user.password;
    return {
      acess_token: this.JwtService.sign(
        {
          sub: user.id,
          name: user.name,
          email: user.email,
        },
        { expiresIn: '7 days', issuer: 'Login' },
      ),
      user,
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JwtService.verify(token, {
        ignoreExpiration: false,
      });
      return data;
    } catch (error) {
      throw new BadRequestException({ message: 'Invalid token', error });
    }
  }

  async isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Usuário inválidos');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Usuário ou senha inválidos');

    return this.cretateToken(user);
  }

  // async forget(email: string) {
  //   const user = await this.prismaService.user.findFirst({
  //     where: { email },
  //   });
  //   if (!user) throw new UnauthorizedException('Email incorreto');

  //   //TODO Enviar o email de recuperação...
  //   await this.mailer.sendMail({
  //     subject: 'Recuperação de senha',
  //     to: 'email',
  //   });
  //   return true;
  // }

  async reset(password: string, token: string) {
    const id = 1;
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: { password },
    });

    return this.cretateToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return await this.cretateToken(user.user);
  }
}

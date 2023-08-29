import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './../auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
//TODO Para utilizar o auth guard em qualquer controller, basta utilizar o decorate @UseGuards(AuthGuard) passando o AuthGuard como parametro, acima da rota, ou do controller inteiro
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authServie: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (token) {
      const data = this.authServie.checkToken(token.split(' ')[1]);
      const user = await this.userService.getById(data.sub);
      request.user = user;
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}

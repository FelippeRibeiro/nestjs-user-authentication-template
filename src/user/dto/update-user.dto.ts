import { IsString, IsEmail, IsStrongPassword } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends CreateUserDTO {}

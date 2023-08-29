import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;
}

import { IsNotEmpty, IsEmail, IsString } from '@nestjs/class-validator';
import { MinLength } from 'class-validator';

export class User_Login_DataDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  readonly password: string;
}

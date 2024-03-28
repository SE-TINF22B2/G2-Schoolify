import { IsNotEmpty, IsEmail, IsString } from '@nestjs/class-validator';

export class User_Login_DataDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

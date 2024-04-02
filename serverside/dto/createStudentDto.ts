import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsNumber,
  ValidateNested,
  IsNotEmptyObject,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class User_Login_DataDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
export class CreateStudentDto {
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => User_Login_DataDto)
  readonly user_Login_Data: User_Login_DataDto;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly lastname: string;
}

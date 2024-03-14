import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsNumber,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsNotEmptyObject } from 'class-validator';

export class User_Login_DataDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  // @IsNotEmpty()
  // readonly role: userRole;
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

  @IsNotEmpty()
  @IsNumber()
  readonly classID: number;
}

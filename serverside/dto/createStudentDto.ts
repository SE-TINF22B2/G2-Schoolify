import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsNotEmptyObject,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { User_Login_DataDto } from './loginDTO';

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

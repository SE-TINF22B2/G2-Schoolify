import {
    ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class Create_Class_Dto {
  @IsNotEmpty()
  @IsNumber()
  readonly roomNumber: number;

  @IsNotEmpty()
  @IsString()
  readonly year: string;

  @IsNotEmpty()
  @IsString()
  readonly letter: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly teachers: EmailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly students: EmailDto[];
}

export class UpdateStudentsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly students: EmailDto[];
}
export class UpdateTeacherDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  readonly teachers: EmailDto[];
}

export class EmailDto {
  @IsEmail()
  readonly email: string;
}


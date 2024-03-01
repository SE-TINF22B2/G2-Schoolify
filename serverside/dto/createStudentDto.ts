import { IsString, IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

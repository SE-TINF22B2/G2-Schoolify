import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeacherDto {
  @IsEmpty()
  teacherID: number;
  @IsNotEmpty()
  @IsNumber()
  user_Login_DataID: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
}

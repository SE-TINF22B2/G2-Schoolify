import { IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  teacherID: number;
  @IsNotEmpty()
  user_login_dataid: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
}

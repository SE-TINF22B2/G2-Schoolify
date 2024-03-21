import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';

export class SaveGradeDto {
  @IsNotEmpty()
  @IsNumber()
  readonly grade: number;

  @IsNumber()
  readonly testID: number;

  @IsNotEmpty()
  @IsNumber()
  readonly studentID: number;

  @IsNotEmpty()
  @IsNumber()
  readonly teacherID: number;

  @IsNumber()
  readonly subjectID: number;
}

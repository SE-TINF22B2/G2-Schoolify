import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';

export class createEventDto {
  @IsString()
  @IsNotEmpty()
  readonly topic: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly classID: number;

  @IsNumber()
  @IsNotEmpty()
  readonly teacherID: number;

  @IsNumber()
  readonly testID: number;

  @IsDate()
  @IsNotEmpty()
  readonly dateFrom: Date;

  @IsDate()
  @IsNotEmpty()
  readonly dateTo: Date;
}

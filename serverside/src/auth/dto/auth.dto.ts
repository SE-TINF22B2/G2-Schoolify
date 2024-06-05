import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class AuthPayloadDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

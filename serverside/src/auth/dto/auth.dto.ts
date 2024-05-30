import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}

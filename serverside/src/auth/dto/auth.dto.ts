import { IsNotEmpty } from '@nestjs/class-validator';

export class AuthPayloadDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

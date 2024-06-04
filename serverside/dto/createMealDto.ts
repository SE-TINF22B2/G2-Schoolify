import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { kategorieEnum } from '@prisma/client';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly shortName: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly allergies: string;

  @IsNotEmpty()
  readonly kategorie: kategorieEnum;

  @IsNotEmpty()
  @IsString()
  readonly day: string;
}

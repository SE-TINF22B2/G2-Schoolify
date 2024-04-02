import { ApiTags } from '@nestjs/swagger';
import {
  Headers,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { PrismaClient, Prisma, Food } from '@prisma/client';
import { CreateMealDto } from '../../dto/createMealDto';

@ApiTags('Meal')
@Controller('meal')
export class MealController {
  constructor(
    private readonly mealService: MealService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Post('create')
  async createMeal(
    @Headers('role') role,
    @Body() newMeal: CreateMealDto,
  ): Promise<Food> {
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to create a new meal',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.mealService.createMeal(newMeal, this.prisma);
  }
}

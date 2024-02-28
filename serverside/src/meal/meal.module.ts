import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';

@Module({
  providers: [MealService],
  controllers: [MealController]
})
export class MealModule {}

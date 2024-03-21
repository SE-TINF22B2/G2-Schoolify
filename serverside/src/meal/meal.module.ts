import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    MealService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [MealController],
})
export class MealModule {}

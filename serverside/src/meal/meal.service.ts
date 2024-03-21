import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Food, PrismaClient } from '@prisma/client';
import { CreateMealDto } from 'dto/createMealDto';

@Injectable()
export class MealService {
  async createMeal(newMeal: CreateMealDto, prisma: PrismaClient) {
    // if foodweek does not exist, error will be thrown
    if (!(await this.checkFoodWeek(newMeal.foodWeekId, prisma))) {
      throw new HttpException(
        'foodWeek with ID ' + newMeal.foodWeekId + ' was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const createdMeal: Food = await prisma.food.create({
      data: {
        name: newMeal.name,
        description: newMeal.description,
        ingredients: newMeal.ingredients,
        calories: newMeal.calories,
        allergies: newMeal.allergies,
        extra: newMeal.extra ? newMeal.extra : 'None',
        foodWeekFoodWeekID: newMeal.foodWeekId,
      },
    });

    return createdMeal;
  }

  // check if foodWeek exist
  async checkFoodWeek(
    foodWeekId: number,
    prisma: PrismaClient,
  ): Promise<boolean> {
    const foodWeekCount = await prisma.foodWeek.count({
      where: {
        foodWeekID: foodWeekId,
      },
    });
    return foodWeekCount === 1;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Food, FoodWeek, PrismaClient } from '@prisma/client';
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
    const today = new Date();
    const createdMeal: Food = await prisma.food.create({
      data: {
        name: newMeal.name,
        description: newMeal.description,
        ingredients: newMeal.ingredients,
        calories: newMeal.calories,
        allergies: newMeal.allergies,
        day: today,
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

  // method to get the meals for this week
  async getMealsOfThisWeek(prisma: PrismaClient) {
    const currentDate = new Date();
    const weekDayNumber = (currentDate.getDay() + 6) % 7;
    const firstDay = new Date(currentDate);
    firstDay.setDate(currentDate.getDate() - weekDayNumber);
    firstDay.setHours(2, 0, 0, 0);

    return await this.getMealsOfWeek(firstDay, prisma);
  }

  // method to get the meals for next week
  async getMealsOfNextWeek(prisma: PrismaClient) {
    const currentDate = new Date();
    const weekDayNumber = (currentDate.getDay() + 6) % 7;
    const firstDay = new Date(currentDate);
    firstDay.setDate(currentDate.getDate() - weekDayNumber + 7);
    firstDay.setHours(2, 0, 0, 0);

    return await this.getMealsOfWeek(firstDay, prisma);
  }

  // method to get meals for a week
  // array of foodArrays for each day
  async getMealsOfWeek(startDay: Date, prisma: PrismaClient) {
    const weekID: number = await this.getFoodWeekID(startDay, prisma);

    const responseArray: [Food[], Food[], Food[], Food[], Food[]] = [
      [],
      [],
      [],
      [],
      [],
    ];

    const allFoodsForWeek: Food[] = await prisma.food.findMany({
      where: {
        foodWeekFoodWeekID: weekID,
      },
    });

    allFoodsForWeek.forEach((food) => {
      const day: number = (food.day.getDay() + 6) % 7;

      if (day < responseArray.length) {
        responseArray[day].push(food);
      }
    });

    return responseArray;
  }

  //to get foodweekID
  async getFoodWeekID(day: Date, prisma: PrismaClient) {
    const foodWeek: FoodWeek = await prisma.foodWeek.findFirst({
      where: {
        start: day,
      },
    });
    if (foodWeek != null) {
      return foodWeek.foodWeekID;
    }
    throw new HttpException('no foodweek has been found', HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Food, FoodWeek, PrismaClient } from '@prisma/client';
import { CreateMealDto } from 'dto/createMealDto';

@Injectable()
export class MealService {
  async createMeal(newMeal: CreateMealDto, prisma: PrismaClient) {
    // get first day of week
    const firstDayOfWeek = this.getFirstDayOfWeek(new Date(newMeal.day));

    // get foodweekID depending on the given day and create a new foodWeek if it has not been found
    const foodWeekID = await this.checkFoodWeek(firstDayOfWeek, prisma);

    const createdMeal: Food = await prisma.food.create({
      data: {
        name: newMeal.name,
        shortName: newMeal.shortName,
        description: newMeal.description,
        allergies: newMeal.allergies,
        kategorie: newMeal.kategorie,
        day: newMeal.day,
        foodWeekFoodWeekID: foodWeekID,
      },
    });

    return createdMeal;
  }

  // check if foodWeek exists and return its ID, create a new week if not
  async checkFoodWeek(day: Date, prisma: PrismaClient): Promise<number> {
    const foodWeek: FoodWeek = await prisma.foodWeek.findFirst({
      where: {
        start: day,
      },
    });
    if (foodWeek != null) {
      return foodWeek.foodWeekID;
    } else {
      const createdFoodWeek: FoodWeek = await prisma.foodWeek.create({
        data: {
          start: day,
        },
      });

      return createdFoodWeek.foodWeekID;
    }
  }
  // method to get first day of week
  getFirstDayOfWeek(day: Date): Date {
    const weekDayNumber = (day.getDay() + 6) % 7;
    const firstDay = new Date(day);
    firstDay.setDate(day.getDate() - weekDayNumber);
    firstDay.setHours(2, 0, 0, 0);
    return firstDay;
  }

  // method to get the meals for this week
  async getMealsOfThisWeek(prisma: PrismaClient) {
    const currentDate = new Date();
    console.log(currentDate);
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

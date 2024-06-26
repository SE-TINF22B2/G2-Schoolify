import { Injectable } from '@nestjs/common';
import { FoodWeek, Food, kategorieEnum } from '@prisma/client';

@Injectable()
export class FoodServiceMock {
  foodMock: Food[] = [];
  foodWeekMock: FoodWeek;

  async create(prisma) {
    // Get current date
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);

    // Create FoodWeek record
    this.foodWeekMock = await prisma.foodWeek.upsert({
      where: { foodWeekID: 1 },
      update: {
        start: startOfWeek,
      },
      create: {
        start: startOfWeek,
      },
    });

    const meals = ['Pasta', 'Pizza', 'Burger', 'Salad', 'Steak'];
    const mealsDesc = [
      'Delicious pasta.',
      'Cheesy pizza.',
      'Juicy burger.',
      'Healthy salad.',
      'Steak with vegetables.',
    ];

    for (let i = 0; i < meals.length; i++) {
      this.foodMock[i] = await prisma.food.upsert({
        where: { foodID: i + 1 },
        update: {
          name: meals[i],
          shortName: 'short name',
          description: mealsDesc[i],
          day: today,
          allergies: 'None',
          price: 4.5,
          kategorie: kategorieEnum.Schweinefleisch,
          FoodWeek: {
            connect: {
              foodWeekID: this.foodWeekMock.foodWeekID,
            },
          },
        },
        create: {
          name: meals[i],
          shortName: 'short name',
          description: mealsDesc[i],
          day: today,
          price: 4.5,
          allergies: 'None',
          kategorie: kategorieEnum.Schweinefleisch,
          FoodWeek: {
            connect: {
              foodWeekID: this.foodWeekMock.foodWeekID,
            },
          },
        },
      });
    }
  }

  getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(1, 0, 0, 0);
    return startOfWeek;
  }
  getClasses() {
    return {
      foodMock: this.foodMock,
      foodWeekMock: this.foodWeekMock,
    };
  }
}

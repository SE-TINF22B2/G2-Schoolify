import { Injectable } from '@nestjs/common';
import { FoodWeek, Food } from '@prisma/client';

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
    startOfWeek.setDate(startOfWeek.getDay() + 9);
    this.foodWeekMock = await prisma.foodWeek.upsert({
      where: { foodWeekID: 2 },
      update: {
        start: startOfWeek,
      },
      create: {
        start: startOfWeek,
      },
    });
  }

  getStartOfWeek(date) {
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const startOfWeek = new Date(date.setUTCDate(diff));
    startOfWeek.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    return startOfWeek;
  }
  getClasses() {
    return {
      foodMock: this.foodMock,
      foodWeekMock: this.foodWeekMock,
    };
  }
}

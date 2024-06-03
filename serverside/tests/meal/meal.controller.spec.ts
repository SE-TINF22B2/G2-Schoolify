import { Test, TestingModule } from '@nestjs/testing';
import { MealController } from '../../src/meal/meal.controller';
import { MealService } from '../../src/meal/meal.service';
import { PrismaClient } from '@prisma/client';
import { CreateMealDto } from '../../dto/createMealDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MealController', () => {
  let controller: MealController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealController],
      providers: [
        MealService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<MealController>(MealController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('tests for create meal', () => {
    it('should throw error because role is not admin', async () => {
      const mockRole = 'NotAdmin';

      const createMealSpy = jest.spyOn(controller['mealService'], 'createMeal');

      await expect(
        controller.createMeal(mockRole, {} as CreateMealDto),
      ).rejects.toThrowError(
        new HttpException(
          mockRole + ' is not allowed to create a new meal',
          HttpStatus.FORBIDDEN,
        ),
      );
      expect(createMealSpy).not.toHaveBeenCalled();
    });
    it('should call the service correct', async () => {
      const createMealSpy = jest
        .spyOn(controller['mealService'], 'createMeal')
        .mockResolvedValue(undefined);

      const result = await controller.createMeal('Admin', {} as CreateMealDto);
      expect(result).toBeUndefined();

      expect(createMealSpy).toHaveBeenCalled();
    });
  });

  describe('tests for get meals this week', () => {
    it('should call the service correct', async () => {
      const getPlanThisWeekSpy = jest
        .spyOn(controller['mealService'], 'getMealsOfThisWeek')
        .mockResolvedValue(undefined);

      const result = await controller.getPlanThisWeek();
      expect(result).toBeUndefined();

      expect(getPlanThisWeekSpy).toHaveBeenCalled();
    });
  });
  describe('tests for get meals next week', () => {
    it('should call the service correct', async () => {
      const getPlanNextWeekSpy = jest
        .spyOn(controller['mealService'], 'getMealsOfNextWeek')
        .mockResolvedValue(undefined);

      const result = await controller.getPlanNextWeek();
      expect(result).toBeUndefined();

      expect(getPlanNextWeekSpy).toHaveBeenCalled();
    });
  });
});

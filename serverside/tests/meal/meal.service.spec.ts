import { Test, TestingModule } from '@nestjs/testing';
import { MealService } from '../../src/meal/meal.service';
import { Food, PrismaClient } from '@prisma/client';
import { CreateMealDto } from 'dto/createMealDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MealService', () => {
  let service: MealService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            food: {
              create: jest.fn(),
            },
            foodWeek: {
              count: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<MealService>(MealService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('tests for createMeal function', () => {
    it('should throw an error because foodweek has not been found', async () => {
      const checkFoodWeekSpy = jest
        .spyOn(service, 'checkFoodWeek')
        .mockResolvedValue(false);

      const createMealSpy = jest.spyOn(prisma.food, 'create');
      await expect(
        service.createMeal({ foodWeekId: 1 } as CreateMealDto, prisma),
      ).rejects.toThrowError(
        new HttpException(
          'foodWeek with ID 1 was not found',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(checkFoodWeekSpy).toHaveBeenCalled();
      expect(createMealSpy).not.toHaveBeenCalled();
    });
    it('should call function correctly', async () => {
      const checkFoodWeekSpy = jest
        .spyOn(service, 'checkFoodWeek')
        .mockResolvedValue(true);

      const mockCreatedMeal: Food = {
        foodID: 0,
        name: '',
        description: '',
        ingredients: '',
        calories: '',
        allergies: '',
        extra: '',
        foodWeekFoodWeekID: 1,
      };

      const createMealSpy = jest
        .spyOn(prisma.food, 'create')
        .mockResolvedValue(mockCreatedMeal);

      const createdMeal = await service.createMeal(
        { foodWeekId: 1 } as CreateMealDto,
        prisma,
      );
      expect(createdMeal).toEqual(mockCreatedMeal);
      expect(checkFoodWeekSpy).toHaveBeenCalled();
      expect(createMealSpy).toHaveBeenCalled();
    });
  });
  describe('tests for checkFoodWeek function', () => {
    it('should call and return everything correctly', async () => {
      const countFoodWeekSpy = jest
        .spyOn(prisma.foodWeek, 'count')
        .mockResolvedValue(1);

      const result = await service.checkFoodWeek(1, prisma);
      expect(result).toBe(true);
      expect(countFoodWeekSpy).toHaveBeenCalled();
    });
  });
});

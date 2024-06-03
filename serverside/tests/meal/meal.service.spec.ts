import { Test, TestingModule } from '@nestjs/testing';
import { MealService } from '../../src/meal/meal.service';
import { Food, FoodWeek, PrismaClient } from '@prisma/client';

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
              findMany: jest.fn(),
            },
            foodWeek: {
              count: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
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
  describe('tests for createmeal function', () => {
    it('should create the food correct and call the function correct', async () => {
      const checkFoodWeekSpy = jest
        .spyOn(service, 'checkFoodWeek')
        .mockResolvedValue(1);

      const createMealSpy = jest
        .spyOn(prisma.food, 'create')
        .mockResolvedValue({} as Food);

      const result = await service.createMeal(
        {
          day: '2024-06-05T11:18:01.227Z',
          name: '',
          description: '',
          calories: '',
          allergies: '',
          extra: '',
          ingredients: '',
        },
        prisma,
      );
      expect(result).toEqual({});
      expect(checkFoodWeekSpy).toHaveBeenCalled();
      expect(createMealSpy).toHaveBeenCalled();
    });
  });
  describe('tests for checkFoodWeek function', () => {
    it('should call and return everything correctly', async () => {
      const countFoodWeekSpy = jest
        .spyOn(prisma.foodWeek, 'findFirst')
        .mockResolvedValue({ foodWeekID: 1 } as FoodWeek);

      const result = await service.checkFoodWeek(new Date(), prisma);
      expect(result).toEqual(1);
      expect(countFoodWeekSpy).toHaveBeenCalled();
    });
  });
  describe('tests for getMealsOfThisWeek function', () => {
    it('should call the function', async () => {
      const getMealsSpy = jest
        .spyOn(service, 'getMealsOfWeek')
        .mockResolvedValue(undefined);

      const result = await service.getMealsOfThisWeek(prisma);
      expect(result).toBeUndefined();
      expect(getMealsSpy).toHaveBeenCalled();
    });
  });
  describe('tests for getMealsOfNextWeek function', () => {
    it('should call the function', async () => {
      const getMealsSpy = jest
        .spyOn(service, 'getMealsOfWeek')
        .mockResolvedValue(undefined);

      const result = await service.getMealsOfNextWeek(prisma);
      expect(result).toBeUndefined();
      expect(getMealsSpy).toHaveBeenCalled();
    });
  });
  describe('tests for getMealsOfWeek function', () => {
    it('should call everything correct', async () => {
      const serviceGetFoodWeekSpy = jest
        .spyOn(service, 'getFoodWeekID')
        .mockResolvedValue(1);

      const findManyFoodSpy = jest
        .spyOn(prisma.food, 'findMany')
        .mockResolvedValue([]);

      const result = await service.getMealsOfWeek(new Date(), prisma);
      expect(result).toEqual([[], [], [], [], []]);
      expect(serviceGetFoodWeekSpy).toHaveBeenCalled();
      expect(findManyFoodSpy).toHaveBeenCalled();
    });
  });
  describe('tests for getFoodWeekID function', () => {
    it('should call and return everything correctly', async () => {
      const findFirstFoodWeekSpy = jest
        .spyOn(prisma.foodWeek, 'findFirst')
        .mockResolvedValue({ foodWeekID: 1 } as FoodWeek);

      const result = await service.getFoodWeekID(new Date(), prisma);
      expect(result).toEqual(1);
      expect(findFirstFoodWeekSpy).toHaveBeenCalled();
    });
  });
});

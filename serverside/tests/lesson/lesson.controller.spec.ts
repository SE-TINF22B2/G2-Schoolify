import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from '../../src/lesson/lesson.controller';
import { LessonService } from '../../src/lesson/lesson.service';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LessonController', () => {
  let controller: LessonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        LessonService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<LessonController>(LessonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLessonsForWeek', () => {
    it('should call getLessonsForWeek in LessonService and return the result', async () => {
      const mockWeekStart = '2024-06-03T00:00:00.000Z';
      const mockClassID = 1;

      const lessonServiceSpy = jest
        .spyOn(controller['lessonService'], 'getLessonsForWeek')
        .mockResolvedValue(undefined);

      const result = await controller.getLessonsForWeek(
        mockWeekStart,
        mockClassID,
      );

      expect(result).toBeUndefined;
      expect(lessonServiceSpy).toHaveBeenCalled();
    });
    it('should call getLessonsForWeek without weekstart', async () => {
      const mockClassID = 1;

      const lessonServiceSpy = jest
        .spyOn(controller['lessonService'], 'getLessonsForWeek')
        .mockResolvedValue(undefined);

      const result = await controller.getLessonsForWeek(null, mockClassID);

      expect(result).toBeUndefined;
      expect(lessonServiceSpy).toHaveBeenCalled();
    });
    it('should throw getLessonsForWeek without classID', async () => {
      await expect(controller.getLessonsForWeek(null, null)).rejects.toThrow(
        new HttpException(
          'You cannot ask for a lessonsplan for no class',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});

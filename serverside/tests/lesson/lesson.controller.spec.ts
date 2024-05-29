import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from '../../src/lesson/lesson.controller';
import { LessonService } from '../../src/lesson/lesson.service';
import { PrismaClient } from '@prisma/client';

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
      const mockWeekStart = new Date();
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
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from '../../src/lesson/lesson.service';
import { PrismaClient } from '@prisma/client';

describe('LessonService', () => {
  let service: LessonService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            lesson: {
              findMany: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getLessonsForWeek', () => {
    it('should return lessons for the given week and classID', async () => {
      const mockWeekStart = new Date('2024-05-20');
      const mockClassID = 123;

      const mockLessons = [
        {
          lessonID: 1,
          classClassID: 123,
          day: new Date('2024-05-20'),
          timeslot: 1,
          subjectSubjectID: 1,
          testTestID: 1,
        },
        {
          lessonID: 2,
          classClassID: 123,
          day: new Date('2024-05-21'),
          timeslot: 2,
          subjectSubjectID: 1,
          testTestID: null,
        },
        {
          lessonID: 3,
          classClassID: 123,
          day: new Date('2024-05-22'),
          timeslot: 3,
          subjectSubjectID: 2,
          testTestID: null,
        },
        {
          lessonID: 4,
          classClassID: 123,
          day: new Date('2024-05-23'),
          timeslot: 4,
          subjectSubjectID: 3,
          testTestID: null,
        },
        {
          lessonID: 5,
          classClassID: 123,
          day: new Date('2024-05-24'),
          timeslot: 5,
          subjectSubjectID: 1,
          testTestID: null,
        },
      ];
      const mockVisibleLessons = [
        {
          lessonID: 1,
          classClassID: 123,
          timeslot: 1,
          day: new Date('2024-05-20'),
          subjectSubjectID: 1,
          testTestID: 1,
        },
      ];

      const prismaFindManySpy = jest
        .spyOn(prisma.lesson, 'findMany')
        .mockResolvedValue(mockLessons);

      const result = await service.getLessonsForWeek(
        mockWeekStart,
        mockClassID,
        prisma,
      );

      expect(prismaFindManySpy).toHaveBeenCalledWith({
        where: {
          classClassID: mockClassID,
          day: {
            gte: mockWeekStart,
            lte: new Date(mockWeekStart.getTime() + 5 * 24 * 60 * 60 * 1000), //Montag bis Freitag
          },
        },
        include: {
          Subject: true,
          Test: true,
        },
      });
      //Für jeden Tag eine Stunde, Montag bis Freitag
      expect(result).toHaveLength(5);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toHaveLength(1);
      expect(result[2]).toHaveLength(1);
      expect(result[3]).toHaveLength(1);
      expect(result[4]).toHaveLength(1);
      expect(result[0]).toEqual(mockVisibleLessons);
    });
  });
});

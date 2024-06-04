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
            subject: {
              findMany: jest.fn(),
            },
            test: {
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

      const mockSubjects = [
        {
          subjectID: 1,
          name: 'Mathe',
        },
        {
          subjectID: 2,
          name: 'Englisch',
        },
        {
          subjectID: 3,
          name: 'Deutsch',
        },
      ];
      const mockTests = [
        {
          testID: 1,
          topic: 'Yannis den Popo versohlen',
        },
      ];

      const mockLessons = [
        {
          lessonID: 1,
          classClassID: 123,
          timeslot: 1,
          startTime: new Date('2024-05-20T08:00:00'),
          subjectSubjectID: 1,
          testTestID: 1,
          duration: 45,
        },
        {
          lessonID: 2,
          classClassID: 123,
          timeslot: 2,
          startTime: new Date('2024-05-21T08:00:00'),
          subjectSubjectID: 1,
          testTestID: null,
          duration: 45,
        },
        {
          lessonID: 3,
          classClassID: 123,
          timeslot: 3,
          startTime: new Date('2024-05-22T08:00:00'),
          subjectSubjectID: 2,
          testTestID: null,
          duration: 45,
        },
        {
          lessonID: 4,
          classClassID: 123,
          timeslot: 4,
          startTime: new Date('2024-05-23T08:00:00'),
          subjectSubjectID: 3,
          testTestID: null,
          duration: 45,
        },
        {
          lessonID: 5,
          classClassID: 123,
          timeslot: 5,
          startTime: new Date('2024-05-24T08:00:00'),
          subjectSubjectID: 1,
          testTestID: null,
          duration: 45,
        },
      ];
      const mockVisibleLessons = [
        {
          lessonID: 1,
          classClassID: 123,
          timeslot: 1,
          startTime: new Date('2024-05-20T08:00:00'),
          subjectSubjectID: 1,
          testTestID: 1,
          testName: 'Yannis den Popo versohlen',
          duration: 45,
          subjectName: 'Mathe',
        },
      ];

      const prismaFindManySpy = jest
        .spyOn(prisma.lesson, 'findMany')
        .mockResolvedValue(mockLessons);

      const prismaSubjectFindManySpy = jest
        .spyOn(prisma.subject, 'findMany')
        .mockResolvedValue(mockSubjects);

      const prismaTestFindManySpy = jest
        .spyOn(prisma.test, 'findMany')
        .mockResolvedValue(mockTests);

      const result = await service.getLessonsForWeek(
        mockWeekStart,
        mockClassID,
        prisma,
      );

      expect(prismaFindManySpy).toHaveBeenCalledWith({
        where: {
          classClassID: mockClassID,
          startTime: {
            gte: mockWeekStart,
            lte: new Date(mockWeekStart.getTime() + 5 * 24 * 60 * 60 * 1000), //Montag bis Freitag
          },
        },
      });
      expect(prismaSubjectFindManySpy).toHaveBeenCalled();
      expect(prismaTestFindManySpy).toHaveBeenCalled();
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

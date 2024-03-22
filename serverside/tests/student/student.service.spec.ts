import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../../src/student/student.service';
import { PrismaClient, Student } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StudentService', () => {
  let service: StudentService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            student: {
              findUnique: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tests for getStudent function', () => {
    it('should throw exception if no student was found', async () => {
      const prismaSpy = jest
        .spyOn(prisma.student, 'findUnique')
        .mockResolvedValue(undefined);

      const mockId = 1;
      await expect(service.getStudent(mockId, prisma)).rejects.toThrowError(
        new HttpException(
          'student with id ' + mockId + ' was not found',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(prismaSpy).toHaveBeenCalledWith({
        where: {
          studentID: mockId,
        },
        select: {
          studentID: true,
          name: true,
          lastname: true,
          classClassID: true,
          user_Login_DataUser_Login_DataID: true,
          grades: {
            select: {
              gradeID: true,
              grade: true,
              testTestID: false,
              Test: true,
              teacherTeacherID: false,
              Teacher: true,
              subjectSubjectID: false,
              Subject: true,
            },
          },
        },
      });
    });
    it('should return the student correct', async () => {
      const prismaSpy = jest
        .spyOn(prisma.student, 'findUnique')
        .mockResolvedValue({} as Student);

      const mockId = 1;

      const result = await service.getStudent(mockId, prisma);
      expect(result).toEqual({});

      expect(prismaSpy).toHaveBeenCalledWith({
        where: {
          studentID: mockId,
        },
        select: {
          studentID: true,
          name: true,
          lastname: true,
          classClassID: true,
          user_Login_DataUser_Login_DataID: true,
          grades: {
            select: {
              gradeID: true,
              grade: true,
              testTestID: false,
              Test: true,
              teacherTeacherID: false,
              Teacher: true,
              subjectSubjectID: false,
              Subject: true,
            },
          },
        },
      });
    });
  });
});

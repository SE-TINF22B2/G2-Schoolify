import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../../src/student/student.service';
import { PrismaClient, Student, User_Login_Data } from '@prisma/client';
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
            user_Login_Data: {
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
        .spyOn(prisma.user_Login_Data, 'findUnique')
        .mockResolvedValue(undefined);

      const mockMail = 'mail';
      await expect(service.getStudent(mockMail, prisma)).rejects.toThrowError(
        new HttpException(
          'student with mail ' + mockMail + ' was not found',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(prismaSpy).toHaveBeenCalledWith({
        where: {
          email: mockMail,
        },
        select: {
          user_Login_DataID: true,
          role: true,
        },
      });
    });
    it('should return the student correct', async () => {
      const mockID = 1;
      const prismaFindLoginDataSpy = jest
        .spyOn(prisma.user_Login_Data, 'findUnique')
        .mockResolvedValue({
          user_Login_DataID: mockID,
          role: 'Student',
        } as User_Login_Data);

      const prismaFindStudentSpy = jest
        .spyOn(prisma.student, 'findUnique')
        .mockResolvedValue({} as Student);

      const mockMail = 'mail';

      const result = await service.getStudent(mockMail, prisma);
      expect(result).toEqual({});

      expect(prismaFindLoginDataSpy).toHaveBeenCalledWith({
        where: {
          email: mockMail,
        },
        select: {
          user_Login_DataID: true,
          role: true,
        },
      });

      expect(prismaFindStudentSpy).toHaveBeenCalledWith({
        where: {
          user_Login_DataUser_Login_DataID: mockID,
        },
        select: {
          studentID: true,
          name: true,
          lastname: true,
          classClassID: true,
          Class: true,
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

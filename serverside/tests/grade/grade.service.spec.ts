'use strict';
import { Test, TestingModule } from '@nestjs/testing';
import { GradeService } from '../../src/grade/grade.service';
import { SaveGradeDto } from '../../dto/saveGradeDto';
import { PrismaClient, Grade, Teacher, Student } from '@prisma/client';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('GradeService', () => {
  let gradeService: GradeService;
  let prisma: PrismaClient;

  const mockCreateGrade: SaveGradeDto = {
    grade: 1,
    testID: 1,
    studentID: 1,
    teacherID: 1,
    subjectID: 1,
  };
  const mockGrade: Grade = {
    gradeID: 1,
    grade: 1,
    testTestID: 1,
    studentStudentID: 1,
    teacherTeacherID: 1,
    subjectSubjectID: 1,
  };
  const mockTeacher: Teacher = {
    teacherID: 1,
    user_Login_DataID: 1,
    name: 'yeet',
    lastname: 'yeet',
  };
  const mockStudent: Student = {
    studentID: 1,
    user_Login_DataID: 1,
    name: 'abc',
    lastname: 'def',
    classID: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            grade: {
              create: jest.fn(),
              findMany: jest.fn(),
              doesExistIn: jest.fn(),
            },
            student: {
              findFirst: jest.fn(),
            },
            teacher: {
              findFirst: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    gradeService = module.get<GradeService>(GradeService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gradeService).toBeDefined();
  });

  describe('saveGrade', () => {
    it('should save grade', async () => {
      const findFirstStudentMock = jest.spyOn(prisma.student, 'findFirst');
      findFirstStudentMock.mockResolvedValueOnce(mockStudent);
      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValue(mockTeacher);

      const prismaCreateSpy = jest
        .spyOn(prisma.grade, 'create')
        .mockResolvedValueOnce(mockGrade);

      const result = await gradeService.saveGrade(mockCreateGrade, prisma);

      expect(prismaCreateSpy).toHaveBeenCalledWith({
        data: {
          grade: 1,
          testTestID: 1,
          studentStudentID: 1,
          teacherTeacherID: 1,
          subjectSubjectID: 1,
        },
      });
      expect(result).toEqual(mockGrade);
    });

    it('should throw NotFoundException if student does not exist', async () => {
      const findFirstMock = jest.spyOn(prisma.student, 'findFirst');
      findFirstMock.mockResolvedValue(null);

      await expect(
        gradeService.saveGrade(mockCreateGrade, prisma),
      ).rejects.toThrow(HttpException);
      expect(prisma.grade.create).not.toBeCalled();
    });
    it('should throw NotFoundException if student does not exist', async () => {
      const findFirstMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstMock.mockResolvedValue(null);

      await expect(
        gradeService.saveGrade(mockCreateGrade, prisma),
      ).rejects.toThrow(HttpException);
      expect(prisma.grade.create).not.toBeCalled();
    });
  });

  describe('getGradesByTestID', () => {
    it('should return grades for a valid test', async () => {
      const testId = 1;

      const findManyMock = prisma.grade.findMany as jest.Mock;
      findManyMock.mockResolvedValueOnce(mockGrade);

      const result = await gradeService.getGradesByTestID(
        testId,
        prisma as PrismaClient,
      );

      expect(result).toEqual(mockGrade);
      expect(prisma.grade.findMany).toHaveBeenCalledWith({
        where: {
          testTestID: testId,
        },
      });
    });

    it('should throw when there is no test with  testID', async () => {
      const invalidTestId = 2;
      const saveGradeMock = prisma.grade.create as jest.Mock;
      saveGradeMock.mockResolvedValue([]);

      await expect(
        gradeService.getGradesByTestID(invalidTestId, prisma as PrismaClient),
      ).rejects.toThrowError(NotFoundException);
      expect(prisma.grade.findMany).toHaveBeenCalledWith({
        where: {
          testTestID: invalidTestId,
        },
      });
    });
  });

  describe('getGradesByStudentID', () => {
    it('should return grades for a valid student ID', async () => {
      const studentID = 1;

      const findManyMock = prisma.grade.findMany as jest.Mock;
      findManyMock.mockResolvedValueOnce(mockGrade);

      const result = await gradeService.getGradesByStudentID(
        studentID,
        prisma as PrismaClient,
      );

      expect(result).toEqual(mockGrade);
      expect(prisma.grade.findMany).toHaveBeenCalledWith({
        where: {
          studentStudentID: studentID,
        },
      });
    });

    it('should throw for an invalid student ID', async () => {
      const invalidStudentId = 2;
      const saveGradeMock = prisma.grade.create as jest.Mock;
      saveGradeMock.mockResolvedValue([]);

      await expect(
        gradeService.getGradesByStudentID(
          invalidStudentId,
          prisma as PrismaClient,
        ),
      ).rejects.toThrowError(NotFoundException);
      expect(prisma.grade.findMany).toHaveBeenCalledWith({
        where: {
          studentStudentID: invalidStudentId,
        },
      });
    });
  });
});

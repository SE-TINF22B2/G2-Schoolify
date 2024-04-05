import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from '../../src/grade/grade.controller';
import { SaveGradeDto } from '../../dto/saveGradeDto';
import { GradeService } from '../../src/grade/grade.service';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';

describe('GradeController', () => {
  let controller: GradeController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeController],
      providers: [
        GradeService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<GradeController>(GradeController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveGrade', () => {
    const mockSaveGradeDto: SaveGradeDto = {
      grade: 1,
      testID: 1,
      studentID: 1,
      teacherID: 1,
      subjectID: 1,
    };

    it('should call gradeService.saveGrade if role is Teacher when saving grade', async () => {
      const mockRole = 'Teacher';

      const saveGradeSpy = jest
        .spyOn(controller['gradeService'], 'saveGrade')
        .mockResolvedValue(null);

      await controller.saveGrade(mockRole, mockSaveGradeDto);

      // Assertion
      expect(saveGradeSpy).toHaveBeenCalledWith(
        mockSaveGradeDto,
        controller['prisma'],
      );
    });
    it('should be forbidden for others', async () => {
      const mockRole = 'User';

      await expect(
        controller.saveGrade(mockRole, mockSaveGradeDto),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to save grades!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getGradesByStudentID', () => {
    const mockUserId = 1;
    const mockStudentId = 1;
    const fakeId = 2;

    it('should call getGradesByStudentID if userID matches studentID', async () => {
      const getGradesByStudentIDSpy = jest
        .spyOn(controller['gradeService'], 'getGradesByStudentID')
        .mockResolvedValue(null);

      await controller.getGradesByStudentID(mockUserId, mockStudentId);

      // Assertion
      expect(getGradesByStudentIDSpy).toHaveBeenCalledWith(
        mockStudentId,
        controller['prisma'],
      );
    });

    it('should throw if user ID is different from student ID', async () => {
      await expect(
        controller.getGradesByStudentID(mockUserId, fakeId),
      ).rejects.toThrow(
        new HttpException(
          mockUserId + ' is not allowed to see the grades from ' + fakeId + '!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getGradesByTestID', () => {
    const mockRole = 'Admin';
    const mockTestId = 1;

    it('should call getGradesByTestID if role is Teacher or Admin', async () => {
      const getGradesByTestIDSpy = jest
        .spyOn(controller['gradeService'], 'getGradesByTestID')
        .mockResolvedValue(null);

      await controller.getGradesByTestID(mockRole, mockTestId);

      expect(getGradesByTestIDSpy).toHaveBeenCalledWith(
        mockTestId,
        controller['prisma'],
      );
    });

    it('should throw HttpException if role is not Teacher or Admin', async () => {
      const mockRole = 'User';

      await expect(
        controller.getGradesByTestID(mockRole, mockTestId),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to see the grades!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getCorrectedTests', () => {
    it('should call function correctly', async () => {
      const mockRole = 'Admin';
      const mockTestId = 1;

      const getCorrectedTestsSpy = jest
        .spyOn(controller['gradeService'], 'getCorrectedTests')
        .mockResolvedValue(null);

      await controller.CorrectedTests(mockRole, mockTestId);

      expect(getCorrectedTestsSpy).toHaveBeenCalledWith(
        mockTestId,
        controller['prisma'],
      );
    });

    it('should throw when dont have access', async () => {
      const mockRole = 'User';
      const mockTestId = 1;

      await expect(
        controller.getGradesByTestID(mockRole, mockTestId),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to see the grades!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getNotCorrectedTests', () => {});
});

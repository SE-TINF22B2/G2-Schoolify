import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceController } from '../../src/absence/absence.controller';
import { AbsenceService } from '../../src/absence/absence.service';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AbsenceController', () => {
  let controller: AbsenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbsenceController],
      providers: [
        AbsenceService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<AbsenceController>(AbsenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('tests for getAbsences', () => {
    it('should throw an error and not call service', async () => {
      const mockRole = 'NotTeacher';

      const serviceSpy = jest.spyOn(
        controller['absenceService'],
        'getAbsences',
      );
      await expect(controller.getAbsences(mockRole, 1)).rejects.toThrowError(
        new HttpException(
          mockRole + ' is not allowed to get absences by lesson ID',
          HttpStatus.FORBIDDEN,
        ),
      );
      expect(serviceSpy).not.toHaveBeenCalled();
    });
    it('should call service correct', async () => {
      const mockRole = 'Teacher';

      const serviceSpy = jest
        .spyOn(controller['absenceService'], 'getAbsences')
        .mockResolvedValue(undefined);
      expect(await controller.getAbsences(mockRole, 1)).toBeUndefined();
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});

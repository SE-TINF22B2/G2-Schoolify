import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from '../../src/student/student.controller';
import { StudentService } from '../../src/student/student.service';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test for get student by id', () => {
    it('should throw an exception because role is not admin', async () => {
      const serviceGetStudentSpy = jest
        .spyOn(controller['studentService'], 'getStudent')
        .mockResolvedValue(undefined);

      const mockRole = 'NotAdmin';

      await expect(
        controller.getStudentByID(mockRole, 'mail'),
      ).rejects.toThrowError(
        new HttpException(
          mockRole + ' is not allowed to get a students info',
          HttpStatus.FORBIDDEN,
        ),
      );

      expect(serviceGetStudentSpy).not.toHaveBeenCalled();
    });
    it('should call the service correctly', async () => {
      const serviceSpy = jest
        .spyOn(controller['studentService'], 'getStudent')
        .mockResolvedValue(undefined);

      expect(
        await controller.getStudentByID('Admin', 'mockMail'),
      ).toBeUndefined();
      expect(serviceSpy).toHaveBeenCalled();
    });
  });
});

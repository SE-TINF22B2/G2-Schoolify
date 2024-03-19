import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from '../../src/class/class.controller';
import { ClassService } from '../../src/class/class.service';
import { Class, PrismaClient } from '@prisma/client';

describe('ClassController', () => {
  let controller: ClassController;
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        ClassService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<ClassController>(ClassController);
    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('tests for get class by ID request', () => {
    it('should return the class for Admin or Teacher role', async () => {
      const mockResult = {
        classID: 1,
        roomNumber: 1,
        letter: 'A',
        year: '2024',
      };
      jest
        .spyOn(service, 'getClassByID')
        .mockImplementation(() => Promise.resolve(mockResult));

      expect(await controller.getClassByID('Admin', 1)).toBe(mockResult);
      expect(await controller.getClassByID('Teacher', 1)).toBe(mockResult);
      expect(service.getClassByID).toBeCalledTimes(2);
    });
    it('should throw an exception for roles other than Admin or Teacher', async () => {
      try {
        await controller.getClassByID('Student', 1);
        fail('Should throw an exception');
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toBe(
          'Student is not allowed to get a class by ID',
        );
      }
    });
  });
  describe('tests for get class by year request', () => {
    it('should return the classes for admin or teacher role', async () => {
      const mockResult: Class[] = [
        { classID: 1, roomNumber: 2, letter: 'A', year: '2024' },
        { classID: 2, roomNumber: 2, letter: 'A', year: '2024' },
      ];
      const roles = ['Admin', 'Teacher'];

      jest
        .spyOn(service, 'getClassByYear')
        .mockImplementation(() => Promise.resolve(mockResult));

      for (const role of roles) {
        expect(await controller.getClassByYear(role, '2001')).toEqual(
          mockResult,
        );
      }

      expect(service.getClassByYear).toBeCalledTimes(roles.length);
    });
    it('should throw an exception for roles not admin or teacher', async () => {
      const invalidRole = 'Student';
      try {
        await controller.getClassByYear(invalidRole, '2001');
        fail('Should throw an exception');
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toBe(
          `${invalidRole} is not allowed to get a class by Year`,
        );
      }
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from '../../src/class/class.controller';
import { ClassService } from '../../src/class/class.service';
import { Class, PrismaClient } from '@prisma/client';
import { HttpException } from '@nestjs/common';
import {
  Create_Class_Dto,
  UpdateStudentsDto,
  UpdateTeacherDto,
} from '../../dto/createClassDto';

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
    it('should return the class for Admin role', async () => {
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
      expect(service.getClassByID).toBeCalled();
    });
    it('should throw an exception for roles other than Admin', async () => {
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
    it('should return the classes for admin role', async () => {
      const mockResult: Class[] = [
        { classID: 1, roomNumber: 2, letter: 'A', year: '2024' },
        { classID: 2, roomNumber: 2, letter: 'A', year: '2024' },
      ];
      const role = 'Admin';

      jest
        .spyOn(service, 'getClassByYear')
        .mockImplementation(() => Promise.resolve(mockResult));

      expect(await controller.getClassByYear(role, '2001')).toEqual(mockResult);

      expect(service.getClassByYear).toBeCalled();
    });
    it('should throw an exception for roles not admin', async () => {
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
  describe('tests for  create class', () => {
    it('should throw an error because role is not admin', async () => {
      try {
        await controller.createClass('Student', {} as Create_Class_Dto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Student is not allowed to create a new class');
      }
    });
    it('calls ClassService when role is Admin', async () => {
      const createClassDto: Create_Class_Dto = {
        roomNumber: 1,
        year: '2000',
        letter: 'A',
        teachers: [],
        students: [],
      };
      const mockResult: Class = {
        classID: 1,
        roomNumber: 1,
        year: '2000',
        letter: 'A',
      };
      const createClassSpy = jest
        .spyOn(service, 'createClass')
        .mockImplementation(() => Promise.resolve(mockResult));

      expect(await controller.createClass('Admin', createClassDto)).toBe(
        mockResult,
      );

      expect(createClassSpy).toBeCalledTimes(1);
    });
  });
  describe('tests for assign student', () => {
    it('should throw an error because role is not admin', async () => {
      try {
        await controller.assignStudents('Student', 1, {} as UpdateStudentsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Student is not allowed to assign new students to the class',
        );
      }
    });
    it('should call class service when role is admin', async () => {
      const assignStudentSpy = jest
        .spyOn(service, 'assignStudents')
        .mockImplementation(() => Promise.resolve(undefined));

      expect(
        await controller.assignStudents('Admin', 1, {} as UpdateStudentsDto),
      ).toBe(undefined);
      expect(assignStudentSpy).toBeCalledTimes(1);
    });
  });
  describe('tests for assign teacher', () => {
    it('should throw an error because role is not admin', async () => {
      try {
        await controller.assignTeacher('Student', 1, {} as UpdateTeacherDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Student is not allowed to assign new teacher to the class',
        );
      }
    });
    it('should call class service when role is admin', async () => {
      const assignTeacherSpy = jest
        .spyOn(service, 'assignTeacher')
        .mockImplementation(() => Promise.resolve(undefined));

      expect(
        await controller.assignTeacher('Admin', 1, {} as UpdateTeacherDto),
      ).toBe(undefined);
      expect(assignTeacherSpy).toBeCalledTimes(1);
    });
  });
});

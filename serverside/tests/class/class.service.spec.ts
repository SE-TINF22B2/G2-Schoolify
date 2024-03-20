import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from '../../src/class/class.service';
import { Class, PrismaClient } from '@prisma/client';
import { Create_Class_Dto, UpdateStudentsDto } from 'dto/createClassDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ClassService', () => {
  let service: ClassService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            class: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            user_Login_Data: {
              findMany: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tests for createClass function', () => {
    it('should throw an error if a teacher mail does not exist', async () => {
      const mockCreateClassDto: Create_Class_Dto = {
        roomNumber: 0,
        year: '10',
        letter: 'A',
        teachers: [{ email: 'mock@mock.de' }],
        students: [],
      };

      service.checkMails = jest.fn().mockResolvedValue(false);
      await expect(
        service.createClass(mockCreateClassDto, prisma),
      ).rejects.toThrow(
        new HttpException(
          'One or more teacher were not found',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should throw an error if one of teacher mails is not a teacher', async () => {
      const mockCreateClassDto: Create_Class_Dto = {
        roomNumber: 0,
        year: '10',
        letter: 'A',
        teachers: [{ email: 'mock@mock.de' }],
        students: [{ email: 'student@mock.de' }],
      };

      jest
        .spyOn(service, 'checkMails')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(service, 'getUsersByEmail')
        .mockImplementation(() => Promise.resolve([1]));
      jest
        .spyOn(service, 'checkTeacher')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.createClass(mockCreateClassDto, prisma),
      ).rejects.toThrow(
        new HttpException(
          'One ore more teacher mail is not a teacher',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should throw an error if one of students were not found', async () => {
      const mockCreateClassDto: Create_Class_Dto = {
        year: '2021',
        roomNumber: 101,
        letter: 'A',
        teachers: [{ email: 'test_teacher@test.com' }],
        students: [{ email: 'test_student@test.com' }],
      };

      jest
        .spyOn(service, 'checkMails')
        .mockImplementationOnce(() => Promise.resolve(true))
        .mockImplementationOnce(() => Promise.resolve(false));

      jest
        .spyOn(service, 'getUsersByEmail')
        .mockImplementation(() => Promise.resolve([1]));

      jest
        .spyOn(service, 'checkTeacher')
        .mockImplementation(() => Promise.resolve(true));

      await expect(
        service.createClass(mockCreateClassDto, prisma),
      ).rejects.toThrow(
        new HttpException(
          'One or more students were not found',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should call all functions correctly and not throw any error', async () => {
      const mockCreateClassDto: Create_Class_Dto = {
        year: '2021',
        roomNumber: 101,
        letter: 'A',
        teachers: [{ email: 'test_teacher@test.com' }],
        students: [{ email: 'test_student@test.com' }],
      };

      const classID = 1;
      const teacherID = 1;
      const studentID = 1;
      const mockClass: Class = {
        classID: classID,
        roomNumber: 0,
        year: '10',
        letter: 'A',
      };

      jest
        .spyOn(service, 'checkMails')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(service, 'getUsersByEmail')
        .mockImplementation(() => Promise.resolve([studentID]));
      jest
        .spyOn(service, 'checkTeacher')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(service, 'checkStudents')
        .mockImplementation(() => Promise.resolve());
      jest.spyOn(prisma.class, 'create').mockResolvedValue(mockClass);
      jest
        .spyOn(service, 'addStudentsToClass')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(service, 'getRoleID')
        .mockImplementation(() => Promise.resolve([teacherID]));
      jest
        .spyOn(service, 'addTeacherToClass')
        .mockImplementation(() => Promise.resolve());

      const result = await service.createClass(mockCreateClassDto, prisma);
      expect(result).toEqual(mockClass);

      expect(service.checkMails).toBeCalledTimes(2);
      expect(service.getUsersByEmail).toBeCalledTimes(2);
      expect(service.checkTeacher).toBeCalledTimes(1);
      expect(service.checkStudents).toBeCalledTimes(1);
      expect(prisma.class.create).toBeCalledTimes(1);
      expect(service.addStudentsToClass).toBeCalledTimes(1);
      expect(service.getRoleID).toBeCalledTimes(1);
      expect(service.addTeacherToClass).toBeCalledTimes(1);
    });
  });
  describe('tests for getClassById function', () => {
    it('should call function correctly', async () => {
      const classID = 1;

      const expectedClass: Class = {
        classID: classID,
        roomNumber: 1,
        year: '10',
        letter: 'A',
      };

      jest.spyOn(prisma.class, 'findUnique').mockResolvedValue(expectedClass);

      const result = await service.getClassByID(classID, prisma);

      expect(result).toEqual(expectedClass);
      expect(prisma.class.findUnique).toHaveBeenCalledWith({
        where: { classID: classID },
        include: {
          students: true,
          teachers: true,
        },
      });
    });
  });
  describe('tests for getClassByYear function', () => {
    it('should call function correctly', async () => {
      const year = '1';

      const expectedClass: Class = {
        classID: 1,
        roomNumber: 1,
        year: year,
        letter: 'A',
      };

      jest.spyOn(prisma.class, 'findMany').mockResolvedValue([expectedClass]);

      const result = await service.getClassByYear(year, prisma);

      expect(result).toEqual([expectedClass]);
      expect(prisma.class.findMany).toHaveBeenCalledWith({
        where: { year: year },
        include: {
          students: true,
          teachers: true,
        },
      });
    });
  });
  describe('tests for assignStudents function', () => {
    it('should throw an error if the class does not exist', async () => {
      const classID = 1;
      const newStudents: UpdateStudentsDto = {
        students: [{ email: 'test_student@test.com' }],
      };

      jest
        .spyOn(service, 'checkClass')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.assignStudents(newStudents, classID, prisma),
      ).rejects.toThrow(
        new HttpException(
          'class with ID ' + classID + ' not found',
          HttpStatus.NOT_FOUND,
        ),
      );

      expect(service.checkClass).toHaveBeenCalledWith(classID, prisma);
    });
    it('should throw error if one or more students were not found', async () => {
      const classID = 1;
      const newStudents: UpdateStudentsDto = {
        students: [{ email: 'test_student@test.com' }],
      };

      jest
        .spyOn(service, 'checkClass')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(service, 'checkMails')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.assignStudents(newStudents, classID, prisma),
      ).rejects.toThrow(
        new HttpException(
          'One or more students were not found',
          HttpStatus.NOT_FOUND,
        ),
      );

      const emails = newStudents.students.map((emailsDto) => emailsDto.email);
      expect(service.checkMails).toHaveBeenCalledWith(emails, prisma);
    });
    it('should call all functions with correct parameters', async () => {
      const classID = 1;

      const newStudents: UpdateStudentsDto = {
        students: [{ email: 'test_student@test.com' }],
      };

      const studentIDs = [1];
      const classData = {
        classID: 1,
        teachers: [],
        students: [],
        roomNumber: 1,
        year: '10',
        letter: 'A',
      };

      jest.spyOn(service, 'checkClass').mockResolvedValue(true);
      jest.spyOn(service, 'checkMails').mockResolvedValue(true);
      jest.spyOn(service, 'getUsersByEmail').mockResolvedValue(studentIDs);
      jest.spyOn(service, 'addStudentsToClass').mockResolvedValue();
      jest.spyOn(prisma.class, 'findUnique').mockResolvedValue(classData);

      const result = await service.assignStudents(newStudents, classID, prisma);

      expect(result).toEqual(classData);
      expect(service.checkClass).toHaveBeenCalledWith(classID, prisma);
      expect(service.checkMails).toHaveBeenCalledWith(
        newStudents.students.map((emailsDto) => emailsDto.email),
        prisma,
      );
      expect(service.getUsersByEmail).toHaveBeenCalledWith(
        newStudents.students.map((emailsDto) => emailsDto.email),
        prisma,
      );
      expect(service.addStudentsToClass).toHaveBeenCalledWith(
        studentIDs,
        classID,
        prisma,
      );
      expect(prisma.class.findUnique).toHaveBeenCalledWith({
        where: { classID: classID },
        include: {
          students: true,
          teachers: true,
        },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from '../../src/class/class.service';
import { Class, PrismaClient, Teacher, userRole } from '@prisma/client';
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
              count: jest.fn(),
            },
            user_Login_Data: {
              findMany: jest.fn(),
            },
            student: {
              updateMany: jest.fn(),
              findMany: jest.fn(),
            },
            role: {
              create: jest.fn(),
            },
            teacher: {
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
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
  describe('tests for assignTeacher function', () => {
    it('should throw an error if no class exists', async () => {
      service.checkClass = jest.fn().mockResolvedValue(false);

      await expect(
        service.assignTeacher({ teachers: [] }, 1, prisma),
      ).rejects.toThrow('class with ID 1 not found');
    });
    it('should throw error if one ore more teacher were not found', async () => {
      // Mock the checkClass to return true
      service.checkClass = jest.fn().mockResolvedValue(true);

      // Mock the checkMails to return false
      service.checkMails = jest.fn().mockResolvedValue(false);

      await expect(
        service.assignTeacher(
          { teachers: [{ email: 'test@example.com' }] },
          1,
          prisma,
        ),
      ).rejects.toThrow('One or more teacher were not found');
    });
    it('should throw an error if one ore more teacher mails is not a teacher', async () => {
      // Mock the checkClass and checkMails to return true
      service.checkClass = jest.fn().mockResolvedValue(true);
      service.checkMails = jest.fn().mockResolvedValue(true);

      // Mock getUsersByEmail to return with some data
      service.getUsersByEmail = jest.fn().mockResolvedValue([1, 2, 3]);

      // Mock checkTeacher to return false
      service.checkTeacher = jest.fn().mockResolvedValue(false);

      await expect(
        service.assignTeacher(
          { teachers: [{ email: 'test@example.com' }] },
          1,
          prisma,
        ),
      ).rejects.toThrow('One ore more teacher mail is not a teacher');
    });
    it('should call all functions correctly', async () => {
      // Mock all the required methods to return expected output
      service.checkClass = jest.fn().mockResolvedValue(true);
      service.checkMails = jest.fn().mockResolvedValue(true);
      service.getUsersByEmail = jest.fn().mockResolvedValue([1, 2, 3]);
      service.checkTeacher = jest.fn().mockResolvedValue(true);
      service.addTeacherToClass = jest.fn().mockResolvedValue(null);

      const expectedReturn = {
        classID: 1,
        roomNumber: 1,
        year: '10',
        letter: 'A',
        students: [],
        teachers: [],
      };
      jest.spyOn(prisma.class, 'findUnique').mockResolvedValue(expectedReturn);

      const inputTeachers = { teachers: [{ email: 'test@example.com' }] };
      const classID = 1;

      const result = await service.assignTeacher(
        inputTeachers,
        classID,
        prisma,
      );

      // Check methods were called with correct arguments
      expect(service.checkClass).toBeCalledWith(classID, prisma);
      expect(service.checkMails).toBeCalledWith(
        inputTeachers.teachers.map((t) => t.email),
        prisma,
      );
      expect(service.getUsersByEmail).toBeCalledWith(
        inputTeachers.teachers.map((t) => t.email),
        prisma,
      );
      expect(service.checkTeacher).toBeCalledWith([1, 2, 3], prisma);
      expect(service.addTeacherToClass).toBeCalledWith(
        [1, 2, 3],
        classID,
        prisma,
      );

      // Check final returned class
      expect(result).toEqual(expectedReturn);
    });
  });
  describe('tests for checkClass function', () => {
    it('should call everything correct', async () => {
      const mockClassId = 1;
      const countSpy = jest.spyOn(prisma.class, 'count').mockResolvedValue(1);
      expect(await service.checkClass(mockClassId, prisma)).toBe(true);
      expect(countSpy).toBeCalledWith({
        where: {
          classID: mockClassId,
        },
      });
    });
  });
  describe('tests for addStudentsToClass function', () => {
    it('should call everything correct', async () => {
      const mockStudents = [1];
      const mockClassID = 1;
      const updateManySpy = jest
        .spyOn(prisma.student, 'updateMany')
        .mockImplementation(() => {
          return undefined;
        });
      await service.addStudentsToClass(mockStudents, mockClassID, prisma);
      expect(updateManySpy).toBeCalledWith({
        where: {
          user_Login_DataUser_Login_DataID: {
            in: mockStudents,
          },
        },
        data: {
          classClassID: mockClassID,
        },
      });
    });
  });
  describe('tests for addTeacherToClass function', () => {
    it('should call everything correct', async () => {
      const teacherIDs = [1, 2, 3];
      const classID = 1;

      await service.addTeacherToClass(teacherIDs, classID, prisma);

      expect(prisma.$transaction).toBeCalled();
      expect(prisma.role.create).toHaveBeenCalledTimes(teacherIDs.length);

      teacherIDs.forEach((teacherId, idx) => {
        expect(prisma.role.create).toHaveBeenNthCalledWith(idx + 1, {
          data: {
            Teacher: {
              connect: { teacherID: teacherId },
            },
            Class: {
              connect: { classID: classID },
            },
          },
        });
      });
    });
  });
  describe('tests for checkTeacher function', () => {
    it('should call everything correct', async () => {
      const mockTeachers = [1, 2];
      const prismaFindManySpy = jest
        .spyOn(prisma.teacher, 'findMany')
        .mockResolvedValue(mockTeachers as unknown as Teacher[]);
      expect(await service.checkTeacher(mockTeachers, prisma)).toBe(true);
      expect(prismaFindManySpy).toBeCalledWith({
        where: {
          user_Login_DataUser_Login_DataID: {
            in: mockTeachers,
          },
        },
      });
    });
  });
  describe('tests for checkStudents function', () => {
    it('should throw an error because one student is already assigned', async () => {
      const studentIds = [1, 2, 3];
      const classID = 1;

      const studentFindManySpy = jest
        .spyOn(prisma.student, 'findMany')
        .mockResolvedValue([
          {
            studentID: 2,
            classClassID: 5,
            user_Login_DataUser_Login_DataID: 1,
            name: 'MockName',
            lastname: 'MockLastName',
          },
        ]);

      try {
        await service.checkStudents(studentIds, classID, prisma);
      } catch (error) {
        expect(studentFindManySpy).toHaveBeenCalledWith({
          where: {
            user_Login_DataUser_Login_DataID: {
              in: studentIds,
            },
            classClassID: {
              not: null,
            },
          },
        });
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toBe(
          'One or more student is already assigned to a class',
        );
      }
    });
    it('should call everything correct', async () => {
      const studentIds = [1, 2, 3];
      const classID = 1;

      const studentFindManySpy = jest
        .spyOn(prisma.student, 'findMany')
        .mockResolvedValue([]);

      await service.checkStudents(studentIds, classID, prisma);

      expect(studentFindManySpy).toHaveBeenCalledWith({
        where: {
          user_Login_DataUser_Login_DataID: {
            in: studentIds,
          },
          classClassID: {
            not: null,
          },
        },
      });
    });
  });
  describe('tests for checkMails function', () => {
    it('should call everything correct', async () => {
      const mockEmails = ['mock@mock.de'];
      const expectedResult = [
        {
          user_Login_DataID: 1,
          email: 'mock@mock.de',
          password: '1234',
          role: userRole.Teacher,
        },
      ];
      const userLoginDataFindManySpy = jest
        .spyOn(prisma.user_Login_Data, 'findMany')
        .mockResolvedValue(expectedResult);

      expect(await service.checkMails(mockEmails, prisma)).toBe(true);
      expect(userLoginDataFindManySpy).toBeCalledWith({
        where: {
          email: {
            in: mockEmails,
          },
        },
      });
    });
  });
  describe('tests for getUsersByEmail function', () => {
    it('should call everything correct', async () => {
      const emailIds = [
        'test1@example.com',
        'test2@example.com',
        'test3@example.com',
      ];

      const prismaMockSpy = jest
        .spyOn(prisma.user_Login_Data, 'findMany')
        .mockResolvedValue([
          {
            user_Login_DataID: 1,
            email: '',
            password: '',
            role: userRole.Admin,
          },
          {
            user_Login_DataID: 2,
            email: '',
            password: '',
            role: userRole.Admin,
          },
          {
            user_Login_DataID: 3,
            email: '',
            password: '',
            role: userRole.Admin,
          },
        ]);

      const result = await service.getUsersByEmail(emailIds, prisma);

      expect(prismaMockSpy).toHaveBeenCalledWith({
        where: {
          email: { in: emailIds },
        },
        select: { user_Login_DataID: true },
      });

      expect(result).toEqual([1, 2, 3]);
    });
  });
  describe('tests for getRoleID function', () => {
    it('should call everything correct', async () => {
      const loginIds = [1, 2, 3];

      const prismaMockSpy = jest
        .spyOn(prisma.teacher, 'findMany')
        .mockResolvedValue([
          {
            teacherID: 1,
            user_Login_DataUser_Login_DataID: 1,
            name: '',
            lastname: '',
          },
          {
            teacherID: 2,
            user_Login_DataUser_Login_DataID: 1,
            name: '',
            lastname: '',
          },
          {
            teacherID: 3,
            user_Login_DataUser_Login_DataID: 1,
            name: '',
            lastname: '',
          },
        ]);

      const result = await service.getRoleID(loginIds, prisma);

      expect(prismaMockSpy).toHaveBeenCalledWith({
        where: {
          user_Login_DataUser_Login_DataID: { in: loginIds },
        },
        select: { teacherID: true },
      });

      expect(result).toEqual([1, 2, 3]);
    });
  });
});

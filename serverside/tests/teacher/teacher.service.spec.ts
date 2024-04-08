import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from '../../src/teacher/teacher.service';
import { PrismaClient, Teacher } from '@prisma/client';

describe('TeacherService', () => {
  let service: TeacherService;
  let prisma: PrismaClient;

  // const createTeacherData: Teacher = {
  //   user_Login_DataUser_Login_DataID: 1,
  //   name: 'Yannis',
  //   lastname: 'Moser',
  // };

  // const mockUserLoginData: User_Login_Data = {
  //   user_Login_DataID: 1,
  //   email: 'Test@Test.com',
  //   password: 'Test',
  // };

  const mockTeacher: Teacher = {
    teacherID: 1,
    user_Login_DataUser_Login_DataID: 1,
    name: 'yeet',
    lastname: 'yeet',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            teacher: {
              create: jest.fn(),
              findMany: jest.fn(),
              doesExistIn: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tests for searchTeacher function', () => {
    it('should return a teacher', async () => {
      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValueOnce(mockTeacher);

      const prismaCreateSpy = jest
        .spyOn(prisma.teacher, 'findFirst')
        .mockResolvedValueOnce(mockTeacher);

      const result = await service.teacher({ teacherID: 1 });

      expect(prismaCreateSpy).toHaveBeenCalledWith({
        data: {
          teacherID: 1,
          user_Login_DataUser_Login_DataID: 1,
          name: 'yeet',
          lastname: 'yeet',
        },
      });
      expect(result).toEqual(mockTeacher);
    });
  });

  // describe('test for getting a list of teachers', () => {
  //   it('should return a teacher', async () => {});
  // });

  // describe('tests for creating a teacher', () => {
  //   it('should return a teacher', async () => {});
  // });

  // describe('tests for patching a teacher', () => {
  //   it('should return a teacher', async () => {});
  // });

  // describe('tests for deleting a teacher', () => {
  //   it('should return a teacher', async () => {});
  // });
});

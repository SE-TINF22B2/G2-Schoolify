import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/auth/users/users.service';
import { PrismaClient, Student, User_Login_Data } from '@prisma/client';
import {
  CreateStudentDto,
  User_Login_DataDto,
} from '../../../dto/createStudentDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  const mockLoginData: User_Login_DataDto = {
    email: 'testing@testing.de',
    password: '1234',
  };
  const mockStudent: CreateStudentDto = {
    user_Login_Data: mockLoginData,
    name: 'Test',
    lastname: 'Student',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            student: {
              create: jest.fn(),
            },
            user_Login_Data: {
              create: jest.fn(),
            },
            class: {
              count: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('tests for createUser function', () => {
    it('should create a user with valid input', async () => {
      // mock result of  createLoginData
      const createLoginDataSyp = jest
        .spyOn(service, 'createLoginData')
        .mockResolvedValueOnce({
          user_Login_DataID: 1234,
          email: 'mock',
          password: 'mock',
          role: 'Student',
        });

      // mock student creation
      const mockCreatedStudent: Student = {
        studentID: 1,
        user_Login_DataUser_Login_DataID: 1234,
        name: 'mock',
        lastname: 'mock',
        classClassID: 1,
      };

      const createStudentMock = prisma.student.create as jest.Mock;
      createStudentMock.mockResolvedValueOnce(mockCreatedStudent);

      //call method
      const result = await service.createUser(mockStudent, prisma);

      // check if result is equal to mockCreatedStudent
      expect(result).toEqual(mockCreatedStudent);

      // check if all functions have been called correctly
      expect(createLoginDataSyp).toHaveBeenCalledWith(
        mockStudent.user_Login_Data,
        prisma,
      );
      expect(createStudentMock).toHaveBeenCalledWith({
        data: {
          User_Login_Data: {
            connect: {
              user_Login_DataID: 1234,
            },
          },
          name: mockStudent.name,
          lastname: mockStudent.lastname,
        },
      });
    });
  });
  describe('tests for createLoginData function', () => {
    it('should create login data correctly', async () => {
      //mock user data creation
      const createUserLoginDataMock = jest.spyOn(
        prisma.user_Login_Data,
        'create',
      );
      const mockReturnLoginData: User_Login_Data = {
        user_Login_DataID: 1,
        email: mockLoginData.email,
        password: mockLoginData.password,
        role: 'Student',
      };
      createUserLoginDataMock.mockResolvedValueOnce(mockReturnLoginData);

      // call method
      const result = await service.createLoginData(mockLoginData, prisma);

      // check if method returns correct value
      expect(result).toEqual(mockReturnLoginData);

      // check if prisma method has been called correctly
      expect(createUserLoginDataMock).toHaveBeenCalledWith({
        data: {
          email: mockReturnLoginData.email,
          password: mockReturnLoginData.password,
          role: mockReturnLoginData.role,
        },
      });
    });
    it('should throw exception when user with email already exists', async () => {
      // mock user login data creation to throw exception
      const createUserLoginDataMock = jest.spyOn(
        prisma.user_Login_Data,
        'create',
      );
      createUserLoginDataMock.mockRejectedValueOnce(new Error('Error'));

      // call method and expect it to throw exception
      await expect(
        service.createLoginData(mockLoginData, prisma),
      ).rejects.toThrowError(
        new HttpException(
          'user with email ' + mockLoginData.email + ' already exists!',
          HttpStatus.CONFLICT,
        ),
      );

      //check if prisma create function has been called correctly
      expect(createUserLoginDataMock).toHaveBeenCalledWith({
        data: {
          email: mockLoginData.email,
          password: mockLoginData.password,
          role: 'Student',
        },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/auth/users/users.controller';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { UsersService } from '../../../src/auth/users/users.service';
import { PrismaClient, Student } from '@prisma/client';
import {
  CreateStudentDto,
  User_Login_DataDto,
} from '../../../dto/createStudentDto';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('call create student correctly', async () => {
    //mock role
    const mockRole = 'Admin';
    //mock return value
    const mockReturnStudent: Student = {
      studentID: 1,
      user_Login_DataUser_Login_DataID: 1,
      name: 'mock',
      lastname: 'mock',
      classClassID: 1,
    };
    const createUserSpy = jest
      .spyOn(controller['userService'], 'createUser')
      .mockResolvedValueOnce(mockReturnStudent);

    const result = await controller.createStudent(mockRole, mockStudent);

    // check if result is as expected
    expect(result).toEqual(mockReturnStudent);

    // check if function has been called
    expect(createUserSpy).toHaveBeenCalledWith(
      mockStudent,
      controller['prisma'],
    );
  });
  it('should return forbidden and not call create student', async () => {
    // mock role not admin
    const mockRole = 'User';

    const createUserSpy = jest.spyOn(controller['userService'], 'createUser');

    // call method and expect forbidden HttpException
    await expect(
      controller.createStudent(mockRole, mockStudent),
    ).rejects.toThrowError(
      new HttpException(
        mockRole + ' is not allowed to create a new student',
        HttpStatus.FORBIDDEN,
      ),
    );

    // expect createUser function to not have been called
    expect(createUserSpy).not.toHaveBeenCalled();
  });
});

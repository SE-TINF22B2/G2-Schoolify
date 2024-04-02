import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaClient, User_Login_Data } from '@prisma/client';
import { User_Login_DataDto } from 'dto/loginDTO';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaClient;

  const mockLogin_dataDTO: User_Login_DataDto = {
    email: 'test.mail@gmail.com',
    password: 'abcdefg',
  };
  const mockLogin_data: User_Login_Data = {
    user_Login_DataID: 1,
    email: 'test.mail@gmail.com',
    password: 'abcdefg',
    role: 'Admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            user_Login_Data: {
              findUnique: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('log in', () => {
    it('should return true if login was successful', async () => {
      const findFirstLoginMock = jest.spyOn(
        prisma.user_Login_Data,
        'findUnique',
      );
      findFirstLoginMock.mockResolvedValueOnce(mockLogin_data);

      const result = await service.logIn(mockLogin_dataDTO, prisma);

      expect(result).toBeTruthy();
    });

    it('should throw notFound for wrong email', async () => {
      const findFirstLoginMock = jest.spyOn(
        prisma.user_Login_Data,
        'findUnique',
      );
      findFirstLoginMock.mockResolvedValueOnce(null);

      await expect(
        service.logIn(mockLogin_dataDTO, prisma),
      ).rejects.toThrowError(
        'Either the User does not exist or the password is wrong. Please try again!',
      );
    });

    it('should throw for wrong password', async () => {
      const findFirstLoginMock = jest.spyOn(
        prisma.user_Login_Data,
        'findUnique',
      );
      findFirstLoginMock.mockResolvedValueOnce(mockLogin_data);

      await expect(
        service.logIn(
          {
            email: 'test.mail@gmail.com',
            password: 'sdsadsad',
          },
          prisma,
        ),
      ).rejects.toThrowError(
        'Either the User does not exist or the password is wrong. Please try again!',
      );
    });
  });
});

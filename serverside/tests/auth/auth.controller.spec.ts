import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { User_Login_DataDto } from '../../dto/loginDTO';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('log in', () => {
    it('should call method no matter which role', async () => {
      const mockLogin_dataDTO: User_Login_DataDto = {
        email: 'test.mail@gmail.com',
        password: 'abcdefg',
      };

      const logInSpy = jest
        .spyOn(controller['authService'], 'logIn')
        .mockResolvedValue(null);

      await controller.logIn(mockLogin_dataDTO);

      expect(logInSpy).toHaveBeenCalledWith(
        mockLogin_dataDTO,
        controller['prisma'],
      );
    });
  });
});

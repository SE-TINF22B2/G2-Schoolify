import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from '../../src/class/class.controller';
import { ClassService } from '../../src/class/class.service';
import { PrismaClient } from '@prisma/client';

describe('ClassController', () => {
  let controller: ClassController;
  let service: ClassService;

  beforeEach(async () => {
    const ClassServiceProvider = {
      provide: ClassService,
      useValue: {
        getClassByID: jest.fn((id) => {
          id;
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        ClassServiceProvider,
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
      const result = { classID: 1, roomNumber: 1, letter: 'A', year: '2024' };
      jest
        .spyOn(service, 'getClassByID')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.getClassByID('Admin', 1)).toBe(result);
      expect(await controller.getClassByID('Teacher', 1)).toBe(result);
      expect(service.getClassByID).toBeCalledTimes(2);
    });
  });
});

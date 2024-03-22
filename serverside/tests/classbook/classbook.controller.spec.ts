import { Test, TestingModule } from '@nestjs/testing';
import { ClassbookController } from '../../src/classbook/classbook.controller';

describe('ClassbookController', () => {
  let controller: ClassbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassbookController],
    }).compile();

    controller = module.get<ClassbookController>(ClassbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

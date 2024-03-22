import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceController } from '../../src/absence/absence.controller';

describe('AbsenceController', () => {
  let controller: AbsenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbsenceController],
    }).compile();

    controller = module.get<AbsenceController>(AbsenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

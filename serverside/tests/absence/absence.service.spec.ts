import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceService } from '../../src/absence/absence.service';

describe('AbsenceService', () => {
  let service: AbsenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbsenceService],
    }).compile();

    service = module.get<AbsenceService>(AbsenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

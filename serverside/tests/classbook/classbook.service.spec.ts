import { Test, TestingModule } from '@nestjs/testing';
import { ClassbookService } from '../../src/classbook/classbook.service';

describe('ClassbookService', () => {
  let service: ClassbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassbookService],
    }).compile();

    service = module.get<ClassbookService>(ClassbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { ClassbookService } from './classbook.service';
import { ClassbookController } from './classbook.controller';

@Module({
  providers: [ClassbookService],
  controllers: [ClassbookController]
})
export class ClassbookModule {}

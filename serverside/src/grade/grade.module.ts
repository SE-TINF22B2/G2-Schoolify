import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';

@Module({
  controllers: [GradeController],
})
export class GradeModule {}

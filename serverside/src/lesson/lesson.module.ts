import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';

@Module({
  controllers: [LessonController],
})
export class LessonModule {}

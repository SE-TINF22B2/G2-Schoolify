import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    LessonService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [LessonController],
})
export class LessonModule {}

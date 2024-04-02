import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    GradeService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [GradeController],
})
export class GradeModule {}

import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    StudentService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [StudentController],
})
export class StudentModule {}

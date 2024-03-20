import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    ClassService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [ClassController],
})
export class ClassModule {}

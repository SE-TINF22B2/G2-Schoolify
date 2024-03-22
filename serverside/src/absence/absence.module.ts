import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    AbsenceService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [AbsenceController],
})
export class AbsenceModule {}

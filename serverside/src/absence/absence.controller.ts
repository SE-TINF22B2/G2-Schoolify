import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { Absent, Prisma, PrismaClient } from '@prisma/client';

@Controller('absence')
export class AbsenceController {
  constructor(
    private readonly absenceService: AbsenceService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Get('/:lessonId')
  async getAbsences(
    @Headers('role') role,
    @Param('lessonId', new ParseIntPipe()) id: number,
  ): Promise<Absent[]> {
    if (role !== 'Teacher') {
      throw new HttpException(
        role + ' is not allowed to get a class by ID',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.absenceService.getAbsences(id, this.prisma);
  }
}

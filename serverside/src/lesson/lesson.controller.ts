import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get, Param } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Prisma, PrismaClient } from '@prisma/client';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Get('getLessonsForWeek/:weekStart/:classId')
  async getLessonsForWeek(
    //@Headers('role') role,
    @Param('weekStart') weekStart: Date,
    @Param('classID', new ParseIntPipe()) classID: number,
  ) {
    //keine Rolle abfragen, da jeder den Stundenplan betrachten kann
    return await this.lessonService.getLessonsForWeek(
      weekStart,
      classID,
      this.prisma,
    );
  }
}

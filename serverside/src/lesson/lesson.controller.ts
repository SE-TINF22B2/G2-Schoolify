import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  ParseIntPipe,
} from '@nestjs/common';
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
    @Param('weekStart') weekStart: string,
    @Param('classId', new ParseIntPipe()) classID: number,
  ) {
    const weekStartDate: Date = weekStart ? new Date(weekStart) : new Date();
    if (!classID) {
      throw new HttpException(
        'You cannot ask for a lessonsplan for no class',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(typeof weekStart);
    //keine Rolle abfragen, da jeder den Stundenplan betrachten kann
    return await this.lessonService.getLessonsForWeek(
      weekStartDate,
      classID,
      this.prisma,
    );
  }
}

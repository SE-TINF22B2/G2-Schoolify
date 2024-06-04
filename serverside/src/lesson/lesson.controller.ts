import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Prisma, PrismaClient } from '@prisma/client';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Get('getLessonsForWeek')
  //http://localhost:3000/lesson/getLessonsForWeek?weekStart=2024-06-03T00:00:00.000Z&classId=1
  //http://localhost:3000/lesson/getLessonsForWeek?classId=1
  async getLessonsForWeek(
    //@Headers('role') role,
    @Query('weekStart') weekStart: string,
    @Query('classId', new ParseIntPipe()) classID: number,
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

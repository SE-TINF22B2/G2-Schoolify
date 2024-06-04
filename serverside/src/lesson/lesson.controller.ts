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
  async getLessonsForWeek(
    //@Headers('role') role,
    @Query('weekStart') weekStart: string,
    @Query('classId', new ParseIntPipe()) classID: number,
  ) {
    const weekStartDate: Date = this.getMonday(
      weekStart ? new Date(weekStart) : new Date(),
    );
    console.log(weekStartDate);
    if (!classID) {
      throw new HttpException(
        'You cannot ask for a lessonsplan for no class',
        HttpStatus.BAD_REQUEST,
      );
    }
    //keine Rolle abfragen, da jeder den Stundenplan betrachten kann
    return await this.lessonService.getLessonsForWeek(
      weekStartDate,
      classID,
      this.prisma,
    );
  }

  private getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6 : 1); //index 0 ist Sonntag, 1 Montag
    return new Date(date.setDate(diff));
  }
}

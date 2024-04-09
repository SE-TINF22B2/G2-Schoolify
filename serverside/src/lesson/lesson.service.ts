import { Injectable } from '@nestjs/common';
import { PrismaClient, Lesson } from '@prisma/client';
import moment from 'moment';

@Injectable()
export class LessonService {
  async getLessonsForWeek(classID: number, weekStart: string, prisma: PrismaClient) : Promise<Lesson[]> {
    const lessons: Lesson[] = await prisma.lesson.findMany({
      where: {
        classClassID: classID,
        startTime : {
          gte: new Date(weekStart),
          lt: moment(weekStart).add(5, 'days').toDate(),
        }
      }
    });
    return lessons
  }

}

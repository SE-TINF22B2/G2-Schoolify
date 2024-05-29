import { Injectable } from '@nestjs/common';
import { PrismaClient, Lesson } from '@prisma/client';

@Injectable()
export class LessonService {
  async getLessonsForWeek(
    weekStart: Date,
    classID: number,
    prisma: PrismaClient,
  ): Promise<Lesson[][]> {
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 5); // Nur Montag bis Freitag, da am Wochenende keine Schule

    const lessons: Lesson[] = await prisma.lesson.findMany({
      where: {
        classClassID: classID,
        startTime: {
          gte: weekStart,
          lte: endOfWeek,
        },
      },
    });

    const lessonsByDay: Lesson[][] = [[], [], [], [], []];

    for (const lesson of lessons) {
      const dayIndex = this.getDayIndex(lesson.startTime);
      lessonsByDay[dayIndex].push(lesson);
    }

    return lessonsByDay;
  }

  private getDayIndex(date: Date): number {
    // 0 = Montag, 1 = Dienstag, ..., 4 = Freitag
    return (date.getDay() + 6) % 7;
  }
}

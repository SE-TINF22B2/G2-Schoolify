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
    // Nur Montag bis Freitag, da am Wochenende keine Schule
    endOfWeek.setDate(weekStart.getDate() + 5);

    const lessons: Lesson[] = await prisma.lesson.findMany({
      where: {
        classClassID: classID,
        day: {
          gte: weekStart,
          lte: endOfWeek,
        },
      },
      include: {
        Subject: true,
        Test: true,
      },
    });

    const lessonsByDay = sortLessonsToDates(lessons);
    return lessonsByDay;
  }
}
//Funktion um die Stunden den Tagen zuzuordnen
function sortLessonsToDates(lessons) {
  const lessonsByDay: Lesson[][] = [[], [], [], [], []];

  for (const lesson of lessons) {
    const dayIndex = getDayIndex(lesson.day);
    lessonsByDay[dayIndex].push(lesson);
  }

  return lessonsByDay;
}

//Funktion um den Tag herauszufinden, für welche die Stunden sind
function getDayIndex(date: Date): number {
  // 0 = Montag, 1 = Dienstag, ..., 4 = Freitag
  return (date.getDay() + 6) % 7;
}

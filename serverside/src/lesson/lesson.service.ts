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

    const subjectNames = await getSubjectNames(prisma);

    const lessons: Lesson[] = await prisma.lesson.findMany({
      where: {
        classClassID: classID,
        startTime: {
          gte: weekStart,
          lte: endOfWeek,
        },
      },
    });

    const lessonsWithSubjectName = mapLessonsWithSubjectName(
      lessons,
      subjectNames,
    );
    const lessonsByDay = sortLessonsToDates(lessonsWithSubjectName);
    return lessonsByDay;
  }
}

function mapLessonsWithSubjectName(lessons, subjectNames) {
  return lessons.map((lesson) => ({
    ...lesson,
    subjectName: subjectNames[lesson.subjectSubjectID] || 'No name given',
  }));
}
//Funktion um die Stunden den Tagen zuzuordnen
function sortLessonsToDates(lessons) {
  const lessonsByDay: Lesson[][] = [[], [], [], [], []];

  for (const lesson of lessons) {
    const dayIndex = getDayIndex(lesson.startTime);
    lessonsByDay[dayIndex].push(lesson);
  }

  return lessonsByDay;
}

//Funktion um den Tag herauszufinden, für welche die Stunden sind
function getDayIndex(date: Date): number {
  // 0 = Montag, 1 = Dienstag, ..., 4 = Freitag
  return (date.getDay() + 6) % 7;
}

async function getSubjectNames(prisma) {
  const subjects = await prisma.subject.findMany({
    select: { subjectID: true, name: true },
    orderBy: { subjectID: 'asc' },
  });

  //neues Array, wo SubjectID: 1 an Stelle [1] des Arrays ist.
  const subjectsArray = new Array(subjects.length + 1);
  subjects.forEach((subject) => {
    subjectsArray[subject.subjectID] = subject.name;
  });
  return subjectsArray;
}

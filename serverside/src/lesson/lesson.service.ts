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
    const tests = await prisma.test.findMany();

    const lessons: Lesson[] = await prisma.lesson.findMany({
      where: {
        classClassID: classID,
        startTime: {
          gte: weekStart,
          lte: endOfWeek,
        },
      },
    });

    const lessonsWithSubjectName = mapLessonsUp(lessons, subjectNames, tests);
    const lessonsByDay = sortLessonsToDates(lessonsWithSubjectName);
    return lessonsByDay;
  }
}

function mapLessonsUp(lessons, subjectNames, tests) {
  return lessons.map((lesson) => {
    const subjectName =
      subjectNames[lesson.subjectSubjectID] || 'No name given';
    const testName =
      tests.find((test) => test.testID === lesson.testTestID)?.topic ||
      'No Test';
    return { ...lesson, subjectName, testName };
  });
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

import { Injectable, Inject } from '@nestjs/common';
import { ClassServiceMock } from './mockClass.service';
import { UserServiceMock } from './mockUser.service';
import { Lesson, Subject } from '@prisma/client';

@Injectable()
export class SubjectLessonServiceMock {
  private subjects: Subject[] = [];
  private lessonsA: Lesson[] = [];
  private lessonsB: Lesson[] = [];
  constructor(
    @Inject(UserServiceMock) private userService: UserServiceMock,
    @Inject(ClassServiceMock) private classService: ClassServiceMock,
  ) {}

  async create(prisma) {
    const mockSubjects = ['Mathe', 'English', 'Physic'];
    let startTimeHour = 8;
    const duration = 1;
    const d = new Date();
    const mockClass = this.classService.classA;
    const mockClass1 = this.classService.classB;
    for (let j = 0; j < mockSubjects.length; j++) {
      this.subjects[j] = await prisma.subject.upsert({
        where: { subjectID: j + 1 },
        update: { name: mockSubjects[j] },
        create: { name: mockSubjects[j] },
      });
      for (let i = 0; i < 4; i++) {
        const dateStartTime = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          startTimeHour,
          0,
          0,
        );
        startTimeHour += duration;
        this.lessonsA[i] = await prisma.lesson.upsert({
          where: { lessonID: i + 1 + j * 4 },
          update: {
            Class: { connect: { classID: mockClass.classID } },
            startTime: dateStartTime,
            duration: duration,
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
          create: {
            startTime: dateStartTime,
            duration: duration,
            Class: { connect: { classID: mockClass.classID } },
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
        });
      }
    }
    startTimeHour = 8;
    for (let j = 0; j < mockSubjects.length; j++) {
      for (let i = 0; i < 4; i++) {
        const dateStartTime = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          startTimeHour,
          0,
          0,
        );
        startTimeHour += duration;
        this.lessonsB[i] = await prisma.lesson.upsert({
          where: { lessonID: i + 13 + j * 4 },
          update: {
            startTime: dateStartTime,
            duration: duration,
            Class: { connect: { classID: mockClass1.classID } },
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
          create: {
            startTime: dateStartTime,
            duration: duration,
            Class: { connect: { classID: mockClass1.classID } },
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
        });
      }
    }
  }
  getClasses() {
    return {
      subjects: this.subjects,
      lessonsA: this.lessonsA,
      lessonsB: this.lessonsB,
    };
  }
}

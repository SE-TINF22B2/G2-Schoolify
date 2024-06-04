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
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.lessonsA[i] = await prisma.lesson.upsert({
          where: { lessonID: i + 1 + j * 4 },
          update: {
            Class: { connect: { classID: mockClass.classID } },
            day: day,
            timeslot: i + 1,
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
          create: {
            day: day,
            timeslot: i + 1,
            Class: { connect: { classID: mockClass.classID } },
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
        });
      }
    }
    for (let j = 0; j < mockSubjects.length; j++) {
      for (let i = 0; i < 4; i++) {
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.lessonsB[i] = await prisma.lesson.upsert({
          where: { lessonID: i + 13 + j * 4 },
          update: {
            day: day,
            timeslot: i + 1,
            Class: { connect: { classID: mockClass1.classID } },
            Subject: { connect: { subjectID: this.subjects[j].subjectID } },
          },
          create: {
            day: day,
            timeslot: i + 1,
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

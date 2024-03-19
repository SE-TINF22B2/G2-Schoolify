import { Inject, Injectable } from '@nestjs/common';
import { Grade } from '@prisma/client';
import { EventServiceMock, UserServiceMock } from './mockEvent.service';
import { ClassServiceMock } from './mockClass.service';

@Injectable()
export class GradesServiceMock {
  oralGrades: Grade[] = [];
  writtingGrades: Grade[] = [];

  constructor(
    @Inject(EventServiceMock) private eventServiceMock: EventServiceMock,
    @Inject(ClassServiceMock) private classServiceMock: ClassServiceMock,
    @Inject(UserServiceMock) private userServiceMock: UserServiceMock,
  ) {}

  async create(prisma) {
    const test = this.eventServiceMock.lessontest;

    const marksA = [1, 4];
    const marksB = [3, 2];

    for (let i = 0; i < marksA.length; i++) {
      this.writtingGrades[i] = await prisma.grade.upsert({
        where: { gradeID: i + 1 },
        update: {
          grade: marksA[i],
          Test: {
            connect: {
              testID: test.testID,
            },
          },
          Student: {
            connect: {
              studentID: this.userServiceMock.studentMocks[i].studentID + 1,
            },
          },
          Teacher: {
            connect: {
              teacherID: 1,
            },
          },
        },
        create: {
          grade: marksA[i],
          Test: {
            connect: {
              testID: test.testID,
            },
          },
          Student: {
            connect: {
              studentID: this.userServiceMock.studentMocks[i].studentID + 1,
            },
          },
          Teacher: {
            connect: {
              teacherID: 1,
            },
          },
        },
      });
    }
    for (let i = 0; i < marksB.length; i++) {
      this.oralGrades[i] = await prisma.grade.upsert({
        where: { gradeID: i + 3 },
        update: {
          grade: marksB[i],
          Subject: {
            connect: {
              subjectID: 1,
            },
          },
          Student: {
            connect: {
              studentID: this.userServiceMock.studentMocks[i].studentID + 2,
            },
          },
          Teacher: {
            connect: {
              teacherID: 1,
            },
          },
        },
        create: {
          grade: marksB[i],
          Subject: {
            connect: {
              subjectID: 1,
            },
          },
          Student: {
            connect: {
              studentID: this.userServiceMock.studentMocks[i].studentID + 2,
            },
          },
          Teacher: {
            connect: {
              teacherID: 1,
            },
          },
        },
      });
    }
  }

  getClasses() {
    return {
      writtingGrades: this.writtingGrades,
      oralGrades: this.oralGrades,
    };
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Event, Test } from '@prisma/client';
import { UserServiceMock } from './mockUser.service';
import { ClassServiceMock } from './mockClass.service';

@Injectable()
export class EventServiceMock {
  eventMock: Event;
  eventMockwithTest: Event;
  test: Test;
  lessontest: Test;
  constructor(
    @Inject(UserServiceMock) private userService: UserServiceMock,
    @Inject(ClassServiceMock) private classService: ClassServiceMock,
  ) {}
  async create(prisma) {
    const mockTeacher1 = this.userService.teacherMocks[0];
    const mockTeacher2 = this.userService.teacherMocks[1];
    const mockClass = this.classService.classA;
    const d = new Date();
    // eslint-disable-next-line prettier/prettier
    const date8am = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0, 0);
    // eslint-disable-next-line prettier/prettier
    const date10am = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 10, 0, 0);
    // eslint-disable-next-line prettier/prettier
    const date4pm = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 16, 0, 0);
    this.eventMock = await prisma.event.upsert({
      where: { eventID: 1 },
      update: {
        topic: `MockEvent`,
        Teacher: {
          connect: {
            teacherID: mockTeacher1.teacherID,
          },
        },
        Class: {
          connect: {
            classID: mockClass.classID,
          },
        },
        description: 'MockDescription',
        dateFrom: date8am,
        dateTo: date4pm,
      },
      create: {
        topic: `MockEvent`,
        Teacher: {
          connect: {
            teacherID: mockTeacher1.teacherID,
          },
        },
        Class: {
          connect: {
            classID: mockClass.classID,
          },
        },
        description: 'MockDescription',
        dateFrom: date8am,
        dateTo: date4pm,
      },
    });
    this.test = await prisma.test.upsert({
      where: { testID: 1 },
      update: {
        topic: 'MockPrüfung',
      },
      create: {
        topic: 'MockPrüfung',
      },
    });
    this.eventMockwithTest = await prisma.event.upsert({
      where: { eventID: 2 },
      update: {
        topic: `MockEventwithTest`,
        Test: {
          connect: {
            testID: this.test.testID,
          },
        },
        Teacher: {
          connect: {
            teacherID: mockTeacher2.teacherID,
          },
        },
        Class: {
          connect: {
            classID: mockClass.classID,
          },
        },
        description: 'MockDescription',
        dateFrom: date8am,
        dateTo: date10am,
      },
      create: {
        topic: `MockEventwithTest`,
        Test: {
          connect: {
            testID: this.test.testID,
          },
        },
        Teacher: {
          connect: {
            teacherID: mockTeacher2.teacherID,
          },
        },
        Class: {
          connect: {
            classID: 1,
          },
        },
        description: 'MockDescription',
        dateFrom: date8am,
        dateTo: date10am,
      },
    });
    this.lessontest = await prisma.test.upsert({
      where: { testID: 2 },
      update: {
        topic: 'Binomische Formeln Song singen',
        Lesson: {
          connect: {
            lessonID: 1,
          },
        },
      },
      create: {
        topic: 'Binomische Formeln Song singen',
        Lesson: {
          connect: {
            lessonID: 1,
          },
        },
      },
    });
  }
  getClasses() {
    return {
      eventMock: this.eventMock,
      eventMockwithTest: this.eventMockwithTest,
      test: this.test,
      lessontest: this.lessontest,
    };
  }
}
export { UserServiceMock };

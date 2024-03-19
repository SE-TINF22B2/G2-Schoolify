// mock.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClassServiceMock } from './testdata/mockClass.service';
import { UserServiceMock } from './testdata/mockUser.service';
import { EventServiceMock } from './testdata/mockEvent.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubjectLessonServiceMock } from './testdata/mockSubjectsLesson.service';
import { GradesServiceMock } from './testdata/mockGrades.service';

@Injectable()
export class MockService {
  constructor(
    private readonly classService: ClassServiceMock,
    private readonly userService: UserServiceMock,
    private readonly eventService: EventServiceMock,
    private readonly sublesService: SubjectLessonServiceMock,
    private readonly gradesService: GradesServiceMock,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  async createMockData() {
    await this.classService.create(this.prisma);
    await this.userService.create(this.prisma);
    await this.sublesService.create(this.prisma);
    await this.eventService.create(this.prisma);
    await this.gradesService.create(this.prisma);
  }
}

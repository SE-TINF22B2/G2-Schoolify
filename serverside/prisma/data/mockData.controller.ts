// mock.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClassServiceMock } from './testdata/mockClass.service';
import { UserServiceMock } from './testdata/mockUser.service';
import { EventServiceMock } from './testdata/mockEvent.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubjectLessonServiceMock } from './testdata/mockSubjectsLesson.service';
import { GradesServiceMock } from './testdata/mockGrades.service';
import { FoodServiceMock } from './testdata/mockFood.service';
import { ClassbookEntryServiceMock } from './testdata/mockClassEntries.service';
import { AbsentServiceMock } from './testdata/mockAbsent.service';

@Injectable()
export class MockService {
  constructor(
    private readonly classService: ClassServiceMock,
    private readonly userService: UserServiceMock,
    private readonly eventService: EventServiceMock,
    private readonly sublesService: SubjectLessonServiceMock,
    private readonly gradesService: GradesServiceMock,
    private readonly foodService: FoodServiceMock,
    private readonly classbookEntryServiceMock: ClassbookEntryServiceMock,
    private readonly absentServiceMock: AbsentServiceMock,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  async createMockData() {
    await this.classService.create(this.prisma);
    await this.userService.create(this.prisma);
    await this.sublesService.create(this.prisma);
    await this.eventService.create(this.prisma);
    await this.gradesService.create(this.prisma);
    await this.foodService.create(this.prisma);
    await this.classbookEntryServiceMock.create(this.prisma);
    await this.absentServiceMock.create(this.prisma);
  }
}

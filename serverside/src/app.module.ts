import { Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MealModule } from './meal/meal.module';
import { EventController } from './event/event.controller';
import { EventModule } from './event/event.module';
import { TestModule } from './test/test.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { ClassService } from './class/class.service';
import { ClassModule } from './class/class.module';
import { GradeService } from './grade/grade.service';
import { GradeModule } from './grade/grade.module';
import { LessonService } from './lesson/lesson.service';
import { LessonModule } from './lesson/lesson.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClassServiceMock } from '../prisma/data/testdata/mockClass.service';
import { UserServiceMock } from '../prisma/data/testdata/mockUser.service';
import { PrismaClient } from '@prisma/client';
import { MockService } from '../prisma/data/mockData.controller';
import { EventServiceMock } from 'prisma/data/testdata/mockEvent.service';
import { SubjectLessonServiceMock } from 'prisma/data/testdata/mockSubjectsLesson.service';
import { UserService } from './user/user.service';
import { GradesServiceMock } from 'prisma/data/testdata/mockGrades.service';
import { FoodServiceMock } from 'prisma/data/testdata/mockFood.service';
import { ClassbookEntryServiceMock } from 'prisma/data/testdata/mockClassEntries.service';
import { AbsentServiceMock } from 'prisma/data/testdata/mockAbsent.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MealModule,
    EventModule,
    UserModule,
    TestModule,
    TeacherModule,
    StudentModule,
    ClassModule,
    GradeModule,
    LessonModule,
  ],
  controllers: [EventController],
  providers: [
    ClassService,
    GradeService,
    LessonService,
    UserService,
    ClassServiceMock,
    UserServiceMock,
    MockService,
    EventServiceMock,
    SubjectLessonServiceMock,
    GradesServiceMock,
    FoodServiceMock,
    ClassbookEntryServiceMock,
    AbsentServiceMock,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly mockService: MockService) {}
  async onApplicationBootstrap() {
    if (process.env.npm_lifecycle_event === 'start:mock') {
      await this.mockService.createMockData();
      this.logger.log('Mock data created.');
    } else {
      this.logger.log('Mock data creation was skiped.');
    }
  }
}

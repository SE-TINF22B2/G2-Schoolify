import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { AbsenceModule } from './absence/absence.module';
import { ClassbookModule } from './classbook/classbook.module';

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
    AbsenceModule,
    ClassbookModule,
  ],
  controllers: [AppController, EventController],
  providers: [
    AppService,
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
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly mockService: MockService) {}
  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'production') {
      await this.mockService.createMockData();
      console.log('Mock data created.');
    }
  }
}

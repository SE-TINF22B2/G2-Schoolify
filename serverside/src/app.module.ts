import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClassService } from '../prisma/data/testdata/mockClass.service';
import { UserService } from '../prisma/data/testdata/mockUser.service';
import { PrismaClient } from '@prisma/client';
import { MockService } from '../prisma/data/mockData.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ClassService,
    UserService,
    MockService,
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

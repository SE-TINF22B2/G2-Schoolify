import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    TestService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [TestController],
})
export class TestModule {}

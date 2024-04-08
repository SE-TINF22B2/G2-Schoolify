import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaClient } from '@prisma/client';
import { EventController } from './event.controller';

@Module({
  providers: [
    EventService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [EventController],
})
export class EventModule {}

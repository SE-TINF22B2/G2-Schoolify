import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    UsersService,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}

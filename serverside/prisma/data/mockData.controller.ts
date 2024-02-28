// mock.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClassService } from './testdata/mockClass.service';
import { UserService } from './testdata/mockUser.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class MockService {
  constructor(
    private readonly classService: ClassService,
    private readonly userService: UserService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  async createMockData() {
    await this.classService.create(this.prisma);
    await this.userService.create(this.prisma);
  }
}

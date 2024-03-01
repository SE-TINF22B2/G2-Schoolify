// mock.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClassServiceMock } from './testdata/mockClass.service';
import { UserServiceMock } from './testdata/mockUser.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class MockService {
  constructor(
    private readonly classService: ClassServiceMock,
    private readonly userService: UserServiceMock,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  async createMockData() {
    await this.classService.create(this.prisma);
    await this.userService.create(this.prisma);
  }
}

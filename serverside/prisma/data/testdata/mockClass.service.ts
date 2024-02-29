import { Injectable } from '@nestjs/common';
import { Class } from '@prisma/client';

@Injectable()
export class ClassService {
  classA: Class;
  classB: Class;

  async create(prisma) {
    this.classA = await prisma.class.upsert({
      where: { classID: 1 },
      update: {
        roomNumber: 101,
        letter: 'A',
        year: '10',
      },
      create: {
        roomNumber: 101,
        letter: 'A',
        year: '10',
      },
    });
    this.classB = await prisma.class.upsert({
      where: { classID: 2 },
      update: {
        roomNumber: 102,
        letter: 'B',
        year: '10',
      },
      create: {
        roomNumber: 102,
        letter: 'B',
        year: '10',
      },
    });
  }

  getClasses() {
    return { classA: this.classA, classB: this.classB };
  }
}

import { Injectable } from '@nestjs/common';
import { ClassbockEntry, Class } from '@prisma/client';

@Injectable()
export class ClassbookEntryServiceMock {
  classBockEntriesA: ClassbockEntry[] = [];
  classBockEntriesB: ClassbockEntry[] = [];

  async create(prisma) {
    // get all classes
    const classes: Class[] = await prisma.class.findMany();

    const notes = ['Maths Class', 'Science Class', 'History class'];
    for (let i = 0; i < 3; i++) {
      this.classBockEntriesA[i] = await prisma.classbockEntry.upsert({
        where: { classbockEntry: i + 1 },
        update: {
          date: new Date(),
          note: notes[i],
          Class: {
            connect: {
              classID: classes[0].classID,
            },
          },
        },
        create: {
          date: new Date(),
          note: notes[i],
          Class: {
            connect: {
              classID: classes[0].classID,
            },
          },
        },
      });
    }
    for (let i = 0; i < 3; i++) {
      this.classBockEntriesB[i] = await prisma.classbockEntry.upsert({
        where: { classbockEntry: i + 4 },
        update: {
          date: new Date(),
          note: notes[i],
          Class: {
            connect: {
              classID: classes[1].classID,
            },
          },
        },
        create: {
          date: new Date(),
          note: notes[i],
          Class: {
            connect: {
              classID: classes[1].classID,
            },
          },
        },
      });
    }
  }

  getClasses() {
    return {
      classBockEntriesA: this.classBockEntriesA,
      classBockEntriesB: this.classBockEntriesB,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { Absent, User_Login_Data } from '@prisma/client';

@Injectable()
export class AbsentServiceMock {
  absentEntriesA: Absent[] = [];
  absentEntriesB: Absent[] = [];

  async create(prisma) {
    // get all users
    const users: User_Login_Data[] = await prisma.user_Login_Data.findMany();

    const dateFrom = ['2022-09-01', '2022-09-15', '2022-09-20'];
    const dateTo = ['2022-09-05', '2022-09-19', '2022-09-25'];

    for (let i = 0; i < 3; i++) {
      this.absentEntriesA[i] = await prisma.absent.upsert({
        where: { absentID: i + 1 },
        update: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[0].user_Login_DataID,
            },
          },
        },
        create: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[0].user_Login_DataID,
            },
          },
        },
      });
    }
    for (let i = 0; i < 3; i++) {
      this.absentEntriesB[i] = await prisma.absent.upsert({
        where: { absentID: i + 4 },
        update: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[1].user_Login_DataID,
            },
          },
        },
        create: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[1].user_Login_DataID,
            },
          },
        },
      });
    }
    for (let i = 0; i < 3; i++) {
      this.absentEntriesA[i] = await prisma.absent.upsert({
        where: { absentID: i + 7 },
        update: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[3].user_Login_DataID,
            },
          },
        },
        create: {
          dateFrom: dateFrom[i],
          dateTo: dateTo[i],
          User_Login_Data: {
            connect: {
              user_Login_DataID: users[3].user_Login_DataID,
            },
          },
        },
      });
    }
  }

  getAbsentEntries() {
    return {
      absentEntriesA: this.absentEntriesA,
      absentEntriesB: this.absentEntriesB,
    };
  }
}

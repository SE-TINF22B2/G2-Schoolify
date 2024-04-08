import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Class, Event, PrismaClient, Teacher, Test } from '@prisma/client';
import { createEventDto } from 'dto/createEventDto';

@Injectable()
export class EventService {
  async deleteEventByID(id: number, prisma: PrismaClient): Promise<any> {
    return prisma.event.delete({
      where: {
        eventID: id,
      },
    });
  }
  async manipulateEventByID(
    id: number,
    newEvent: createEventDto,
    prisma: PrismaClient,
  ): Promise<any> {
    //check for valid teacher, class, test
    await validInput(newEvent, prisma);

    return prisma.event.update({
      data: newEvent,
      where: {
        eventID: id,
      },
    });
  }

  async getEventsByTeacherID(
    teacherID: number,
    prisma: PrismaClient,
    timespan?: number,
  ): Promise<Event[]> {
    const now = new Date();
    const toDate = new Date(
      now.getFullYear(),
      now.getMonth() + (timespan || 12),
      now.getDate(),
    );
    const events: Event[] = await prisma.event.findMany({
      where: {
        teacherTeacherID: teacherID,
        dateFrom: {
          gte: now,
          lte: toDate,
        },
      },
    });
    return events;
  }

  async getEventsByClassID(
    classID: number,
    prisma: PrismaClient,
    timespan?: number,
  ): Promise<Event[]> {
    const now = new Date();
    const toDate = new Date(
      now.getFullYear(),
      now.getMonth() + (timespan || 12),
      now.getDate(),
    );
    const events: Event[] = await prisma.event.findMany({
      where: {
        classClassID: classID,
        dateFrom: {
          gte: now,
          lte: toDate,
        },
      },
    });
    return events;
  }

  async getEvents(prisma: PrismaClient, timespan?: number): Promise<Event[]> {
    const now = new Date();
    const toDate = new Date(
      now.getFullYear(),
      now.getMonth() + (timespan || 12),
      now.getDate(),
    );
    const events: Event[] = await prisma.event.findMany({
      where: {
        dateFrom: {
          gte: now,
          lte: toDate,
        },
      },
    });
    return events;
  }

  async getEventByID(
    id: number,
    prisma: PrismaClient,
    timespan?: number,
  ): Promise<Event> {
    const now = new Date();
    const toDate = new Date(
      now.getFullYear(),
      now.getMonth() + (timespan || 12),
      now.getDate(),
    );
    const event: Event = await prisma.event.findFirst({
      where: {
        eventID: id,
        dateFrom: {
          gte: now,
          lte: toDate,
        },
      },
    });
    return event;
  }

  async createEvent(
    newEvent: createEventDto,
    prisma: PrismaClient,
  ): Promise<Event> {
    //check for valid class, teacher and Test
    await validInput(newEvent, prisma);

    //create Event
    const event: Event = await prisma.event.create({
      data: {
        topic: newEvent.topic,
        description: newEvent.description,
        classClassID: newEvent.classID,
        teacherTeacherID: newEvent.teacherID,
        testTestID: newEvent.testID,
        dateFrom: newEvent.dateFrom,
        dateTo: newEvent.dateTo,
      },
    });

    return event;
  }
}

function doesNotExist(entity, name) {
  throw new HttpException(
    entity + ' ' + name + ' does not exist!',
    HttpStatus.CONFLICT,
  );
}

async function validInput(newEvent, prisma) {
  const enteredTeacher: Teacher = await prisma.teacher.findFirst({
    where: {
      teacherID: newEvent.teacherID,
    },
  });
  if (!enteredTeacher) doesNotExist('Teacher', newEvent.teacherID);

  const enteredClass: Class = await prisma.class.findFirst({
    where: {
      classID: newEvent.classID,
    },
  });
  if (!enteredClass) doesNotExist('Class', newEvent.classID);

  if (newEvent.testID) {
    const enteredTest: Test = await prisma.test.findFirst({
      where: {
        testID: newEvent.testID,
      },
    });
    if (!enteredTest) doesNotExist('Test', newEvent.testID);
  }
}

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
  ): Promise<Event[]> {
    const events: Event[] = await prisma.event.findMany({
      where: {
        teacherTeacherID: teacherID,
      },
    });
    if (!events) {
      throw new HttpException(
        `There are no events planned for teacher ${teacherID}.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return events;
  }

  async getEventsByClassID(
    classID: number,
    prisma: PrismaClient,
  ): Promise<Event[]> {
    const events: Event[] = await prisma.event.findMany({
      where: {
        classClassID: classID,
      },
    });
    if (!events) {
      throw new HttpException(
        `There are no events planned for class ${classID}.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return events;
  }

  async getEvents(prisma: PrismaClient): Promise<Event[]> {
    const events: Event[] = await prisma.event.findMany();
    if (!events) {
      throw new HttpException(
        'There are no events planned.',
        HttpStatus.NOT_FOUND,
      );
    }
    return events;
  }

  async getEventByID(id: number, prisma: PrismaClient): Promise<Event> {
    const event: Event = await prisma.event.findFirst({
      where: {
        eventID: id,
      },
    });
    if (!event) {
      throw new HttpException(
        `Event ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
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

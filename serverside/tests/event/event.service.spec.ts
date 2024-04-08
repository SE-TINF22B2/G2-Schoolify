import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../../src/event/event.service';
import { Class, Event, PrismaClient, Teacher } from '@prisma/client';
import { createEventDto } from '../../dto/createEventDto';
import { HttpException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: PrismaClient,
          useFactory: () => ({
            event: {
              delete: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            class: {
              findFirst: jest.fn(),
            },
            teacher: {
              findFirst: jest.fn(),
            },
            test: {
              findFirst: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  const mockEvent: Event = {
    eventID: 1,
    topic: '',
    description: '',
    classClassID: 0,
    teacherTeacherID: 0,
    testTestID: 0,
    dateFrom: undefined,
    dateTo: undefined,
  };
  const mockCreateEvent: createEventDto = {
    topic: '',
    description: '',
    classID: 0,
    teacherID: 0,
    testID: 0,
    dateFrom: undefined,
    dateTo: undefined,
  };
  const mockTeacher: Teacher = {
    teacherID: 1,
    user_Login_DataUser_Login_DataID: 1,
    name: 'yeet',
    lastname: 'yeet',
  };
  const mockClass: Class = {
    classID: 0,
    roomNumber: 0,
    year: '',
    letter: '',
  };

  const mockTeacherID = 1;
  const mockClassID = 1;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('manipulateEventByID', () => {
    it('should call prisma.event.update with correct parameters', async () => {
      const mockID = 1;

      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValue(mockTeacher);
      const findFirstClass = jest.spyOn(prisma.class, 'findFirst');
      findFirstClass.mockResolvedValue(mockClass);

      const prismaCreateSpy = jest
        .spyOn(prisma.event, 'update')
        .mockResolvedValueOnce(mockEvent);

      const result = await service.manipulateEventByID(
        mockID,
        mockCreateEvent,
        prisma,
      );

      expect(prismaCreateSpy).toHaveBeenCalledWith({
        data: mockCreateEvent,
        where: {
          eventID: mockID,
        },
      });
      expect(result).toEqual(mockEvent);
    });
    it('should throw for invalid teacher', async () => {
      const mockID = 1;

      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValue(null);
      const findFirstClass = jest.spyOn(prisma.class, 'findFirst');
      findFirstClass.mockResolvedValue(mockClass);

      await expect(
        service.manipulateEventByID(mockID, mockCreateEvent, prisma),
      ).rejects.toThrow(HttpException);
      expect(prisma.event.update).not.toBeCalled();
    });
    it('should throw for invalid class', async () => {
      const mockID = 1;

      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValue(mockTeacher);
      const findFirstClass = jest.spyOn(prisma.class, 'findFirst');
      findFirstClass.mockResolvedValue(null);

      await expect(
        service.manipulateEventByID(mockID, mockCreateEvent, prisma),
      ).rejects.toThrow(HttpException);
      expect(prisma.event.update).not.toBeCalled();
    });
  });

  describe('deleteEventByID', () => {
    it('should call prisma.event.delete with correct parameters', async () => {
      const mockID = 1;

      const prismaDeleteSpy = jest
        .spyOn(prisma.event, 'delete')
        .mockResolvedValueOnce(mockEvent);

      const result = await service.deleteEventByID(mockID, prisma);

      expect(prismaDeleteSpy).toHaveBeenCalledWith({
        where: {
          eventID: mockID,
        },
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEventByID', () => {
    it('should return event for a valid event ID', async () => {
      const mockEventID = 1;
      const findFirstMock = jest.spyOn(prisma.event, 'findFirst');
      findFirstMock.mockResolvedValueOnce(mockEvent);

      const result = await service.getEventByID(mockEventID, prisma);

      expect(findFirstMock).toHaveBeenCalledWith({
        where: {
          eventID: mockEventID,
        },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw for invalid event ID', async () => {
      const mockEventID = 1;
      const findFirstMock = jest.spyOn(prisma.event, 'findFirst');
      findFirstMock.mockResolvedValueOnce(null);

      await expect(service.getEventByID(mockEventID, prisma)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getEventsByTeacherID', () => {
    it('should return events for a valid teacher ID', async () => {
      const findManyMock = jest.spyOn(prisma.event, 'findMany');
      findManyMock.mockResolvedValueOnce([mockEvent]);

      const result = await service.getEventsByTeacherID(mockTeacherID, prisma);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          teacherTeacherID: mockTeacherID,
        },
      });
      expect(result).toEqual([mockEvent]);
    });

    it('should throw for invalid teacher ID', async () => {
      const findFirstTeacherMock = jest.spyOn(prisma.teacher, 'findFirst');
      findFirstTeacherMock.mockResolvedValue(null);

      await expect(
        service.getEventsByTeacherID(mockTeacherID, prisma),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getEventsByClassID', () => {
    it('should return events for a valid class ID', async () => {
      const findManyMock = jest.spyOn(prisma.event, 'findMany');
      findManyMock.mockResolvedValueOnce([mockEvent]);

      const result = await service.getEventsByClassID(mockClassID, prisma);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          classClassID: mockClassID,
        },
      });
      expect(result).toEqual([mockEvent]);
    });

    it('should throw for invalid class ID', async () => {
      const findFirstClass = jest.spyOn(prisma.class, 'findFirst');
      findFirstClass.mockResolvedValue(null);

      await expect(
        service.getEventsByClassID(mockClassID, prisma),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getEvents', () => {
    it('should return events when there are events', async () => {
      const findManyMock = jest.spyOn(prisma.event, 'findMany');
      findManyMock.mockResolvedValueOnce([mockEvent]);

      const result = await service.getEvents(prisma);

      expect(findManyMock).toHaveBeenCalled();
      expect(result).toEqual([mockEvent]);
    });

    it('should throw when there are no events', async () => {
      const findManyMock = jest.spyOn(prisma.event, 'findMany');
      findManyMock.mockResolvedValueOnce(null);

      await expect(service.getEvents(prisma)).rejects.toThrow(HttpException);
    });
  });
});

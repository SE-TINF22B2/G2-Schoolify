import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../../src/event/event.controller';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { EventService } from '../../src/event/event.service';
import { PrismaClient } from '@prisma/client';
import { createEventDto } from '../../dto/createEventDto';

describe('EventController', () => {
  let controller: EventController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        EventService,
        {
          provide: 'PRISMA',
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    const mockCreateEvent: createEventDto = {
      topic: 'Klassenarbeit',
      description: 'oh ja',
      classID: 1,
      teacherID: 1,
      testID: 1,
      dateFrom: new Date(),
      dateTo: new Date(),
    };

    it('should call createEvent if role is Teacher when saving grade', async () => {
      const mockRole = 'Teacher';

      const saveGradeSpy = jest
        .spyOn(controller['eventService'], 'createEvent')
        .mockResolvedValue(null);

      await controller.createEvent(mockRole, mockCreateEvent);

      // Assertion
      expect(saveGradeSpy).toHaveBeenCalledWith(
        mockCreateEvent,
        controller['prisma'],
      );
    });
    it('should be forbidden for others', async () => {
      const mockRole = 'User';

      await expect(
        controller.createEvent(mockRole, mockCreateEvent),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to create Events!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getter', () => {
    const mockEventId = 1;
    const mockTeacherId = 1;
    const mockClassId = 1;

    describe('getAll', () => {
      it('should call getEvents', async () => {
        const getEventsSpy = jest
          .spyOn(controller['eventService'], 'getEvents')
          .mockResolvedValue(null);

        await controller.getEvents();

        expect(getEventsSpy).toHaveBeenCalledWith(
          controller['prisma'],
          undefined,
        );
      });
    });
    describe('getByID', () => {
      it('should call getEventByID ', async () => {
        const getEventByIDSpy = jest
          .spyOn(controller['eventService'], 'getEventByID')
          .mockResolvedValue(null);

        await controller.getEventByID(mockEventId);

        expect(getEventByIDSpy).toHaveBeenCalledWith(
          mockEventId,
          controller['prisma'],
          undefined,
        );
      });
    });
    describe('getByClassID', () => {
      it('should call getEventByID ', async () => {
        const getEventsByClassIDSpy = jest
          .spyOn(controller['eventService'], 'getEventsByClassID')
          .mockResolvedValue(null);

        await controller.getEventsByClassID(mockClassId);

        expect(getEventsByClassIDSpy).toHaveBeenCalledWith(
          mockClassId,
          controller['prisma'],
          undefined,
        );
      });
    });
    describe('getByTeacherID', () => {
      it('should call getEventByID ', async () => {
        const getEventsByTeacherIDSpy = jest
          .spyOn(controller['eventService'], 'getEventsByTeacherID')
          .mockResolvedValue(null);

        await controller.getEventsByTeacherID(mockTeacherId);

        expect(getEventsByTeacherIDSpy).toHaveBeenCalledWith(
          mockTeacherId,
          controller['prisma'],
          undefined,
        );
      });
    });
  });

  describe('delete', () => {
    it('should call deleteEvent if role is Teacher when saving grade', async () => {
      const mockRole = 'Admin';
      const mockEventID = 1;

      const deleteEventByIDSpy = jest
        .spyOn(controller['eventService'], 'deleteEventByID')
        .mockResolvedValue(null);

      await controller.deleteEventByID(mockRole, mockEventID);

      expect(deleteEventByIDSpy).toHaveBeenCalledWith(
        mockEventID,
        controller['prisma'],
      );
    });
    it('should be forbidden for others', async () => {
      const mockRole = 'User ';
      const mockEventID = 1;

      await expect(
        controller.deleteEventByID(mockRole, mockEventID),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to delete Events!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });
  describe('manipulate', () => {
    const mockNewEvent: createEventDto = {
      topic: 'aaa',
      description: 'bbb',
      classID: 0,
      teacherID: 0,
      testID: 0,
      dateFrom: undefined,
      dateTo: undefined,
    };

    it('should manipulate event when role is admin or teacher', async () => {
      const mockRole = 'Admin';
      const mockEventID = 1;

      const manipulateEventSpy = jest
        .spyOn(controller['eventService'], 'manipulateEventByID')
        .mockResolvedValue(null);

      await controller.manipulateEventByID(mockRole, mockEventID, mockNewEvent);

      expect(manipulateEventSpy).toHaveBeenCalledWith(
        mockEventID,
        mockNewEvent,
        controller['prisma'],
      );
    });
    it('should be forbidden for others', async () => {
      const mockRole = 'User ';
      const mockEventID = 1;

      await expect(
        controller.manipulateEventByID(mockRole, mockEventID, mockNewEvent),
      ).rejects.toThrow(
        new HttpException(
          mockRole + ' is not allowed to manipulate Events!',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });
});

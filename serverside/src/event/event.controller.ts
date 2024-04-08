import {
  Controller,
  Inject,
  Post,
  Headers,
  Body,
  Get,
  Put,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { Event, Prisma, PrismaClient } from '@prisma/client';
import { createEventDto } from '../../dto/createEventDto';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  //Create Event (only Teacher and Admin)
  @Post('createEvent')
  async createEvent(
    @Headers('role') role,
    @Body() event: createEventDto,
  ): Promise<any> {
    if (role !== 'Teacher' && role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to create Events!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.eventService.createEvent(event, this.prisma);
  }

  //Get Event (for everyone available)
  @Get('getEventByID/:id')
  async getEventByID(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() timespan?: number,
  ): Promise<Event> {
    return await this.eventService.getEventByID(id, this.prisma, timespan);
  }

  //All Events
  //timespan in months
  @Get('getAllEvent')
  async getEvents(@Body() timespan?: number): Promise<Event[]> {
    return await this.eventService.getEvents(this.prisma, timespan);
  }

  //All Events for Class
  @Get('getEventsByClassID/:id')
  async getEventsByClassID(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() timespan?: number,
  ): Promise<Event[]> {
    return await this.eventService.getEventsByClassID(
      id,
      this.prisma,
      timespan,
    );
  }

  //All Events for Teacher
  @Get('getEventsByTeacherID/:id')
  async getEventsByTeacherID(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() timespan?: number,
  ): Promise<Event[]> {
    return await this.eventService.getEventsByTeacherID(
      id,
      this.prisma,
      timespan,
    );
  }

  //Change Event (only Teacher and Admin)
  @Put('manipulateEventByID/:id')
  async manipulateEventByID(
    @Headers('role') role,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() event: createEventDto,
  ): Promise<any> {
    if (role !== 'Teacher' && role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to manipulate Events!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.eventService.manipulateEventByID(id, event, this.prisma);
  }

  //Delete event (only teacher and admin)
  @Delete('deleteEventByID/:id')
  async deleteEventByID(
    @Headers('role') role,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<any> {
    if (role !== 'Teacher' && role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to delete Events!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.eventService.deleteEventByID(id, this.prisma);
  }
}

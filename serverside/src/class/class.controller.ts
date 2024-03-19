import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  HttpException,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { Class, Prisma, PrismaClient } from '@prisma/client';
import { Create_Class_Dto } from '../../dto/createClassDto';

@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Post('create')
  async createClass(
    @Headers('role') role,
    @Body() newClass: Create_Class_Dto,
  ): Promise<any> {
    // check if role is admin, otherwise throw exception
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to create a new class',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return await this.classService.createClass(newClass, this.prisma);
    }
  }
  @Get('byID/:id')
  async getClassByID(
    @Headers('role') role,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Class> {
    // check role
    if (role !== 'Admin' && role !== 'Teacher') {
      throw new HttpException(
        role + ' is not allowed to get a class by ID',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return await this.classService.getClassByID(id, this.prisma);
    }
  }

  @Get('byYear/:year')
  async getClassByYear(
    @Headers('role') role,
    @Param('year') year: string,
  ): Promise<Class[]> {
    // check role
    if (role !== 'Admin' || 'Teacher') {
      throw new HttpException(
        role + ' is not allowed to get a class by Year',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return await this.classService.getClassByYear(year, this.prisma);
    }
  }
}

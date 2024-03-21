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
  Put,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { Class, Prisma, PrismaClient } from '@prisma/client';
import {
  Create_Class_Dto,
  UpdateStudentsDto,
  UpdateTeacherDto,
} from '../../dto/createClassDto';

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
  @Get('getByID/:id')
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
    }
    return await this.classService.getClassByID(id, this.prisma);
  }

  @Get('getByYear/:year')
  async getClassByYear(
    @Headers('role') role,
    @Param('year') year: string,
  ): Promise<Class[]> {
    // check role
    if (role !== 'Admin' && role !== 'Teacher') {
      throw new HttpException(
        role + ' is not allowed to get a class by Year',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.classService.getClassByYear(year, this.prisma);
  }

  @Put('assignStudent/:classID')
  async assignStudents(
    @Headers('role') role,
    @Param('classID', new ParseIntPipe()) classID: number,
    @Body() newStudents: UpdateStudentsDto,
  ): Promise<Class> {
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to assign new students to the class',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.classService.assignStudents(
      newStudents,
      classID,
      this.prisma,
    );
  }

  @Put('assignTeacher/:classID')
  async assignTeacher(
    @Headers('role') role,
    @Param('classID', new ParseIntPipe()) classID: number,
    @Body() newTeacher: UpdateTeacherDto,
  ): Promise<Class> {
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to assign new teacher to the class',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.classService.assignTeacher(
      newTeacher,
      classID,
      this.prisma,
    );
  }
}

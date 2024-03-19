import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { Create_Class_Dto } from 'dto/createClassDto';

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
}

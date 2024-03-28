import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateStudentDto } from './../../../dto/createStudentDto';
import { Prisma, PrismaClient } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  // post request for admin to create student
  @Post('create')
  async createStudent(
    @Headers('role') role,
    @Body() newStudent: CreateStudentDto,
  ): Promise<any> {
    // check if role is admin, otherwise throw exception
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to create a new student',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return await this.userService.createUser(newStudent, this.prisma);
    }
  }
}

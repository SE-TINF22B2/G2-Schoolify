import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { PrismaClient, Prisma, Student } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Get(':studentMail')
  async getStudentByID(
    @Headers('role') role,
    @Param('studentMail') studentMail: string,
  ): Promise<Student> {
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to get a students info',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.studentService.getStudent(studentMail, this.prisma);
  }
}

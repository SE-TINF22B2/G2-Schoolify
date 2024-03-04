import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateStudentDto } from 'dto/createStudentDto';

@Injectable()
export class UsersService {
  async createUser(
    newStudent: CreateStudentDto,
    prisma,
  ): Promise<CreateStudentDto> {
    // first check if class exists
    const classCount = await prisma.class.count({
      where: {
        classID: newStudent.classID,
      },
    });
    if (classCount == 0) {
      throw new HttpException(
        'class with ' + newStudent.classID + ' does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    // create login data

    // create student

    return newStudent;
  }
}

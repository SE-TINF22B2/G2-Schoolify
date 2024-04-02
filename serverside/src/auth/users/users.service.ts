import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Student, User_Login_Data } from '@prisma/client';
import { CreateStudentDto, User_Login_DataDto } from 'dto/createStudentDto';

@Injectable()
export class UsersService {
  async createUser(
    newStudent: CreateStudentDto,
    prisma: PrismaClient,
  ): Promise<Student> {
    // create login data
    const createdLoginData: User_Login_Data = await this.createLoginData(
      newStudent.user_Login_Data,
      prisma,
    );
    const user_Login_Data_ID = createdLoginData.user_Login_DataID;

    // create student
    const createdStudent: Student = await prisma.student.create({
      data: {
        User_Login_Data: {
          connect: { user_Login_DataID: user_Login_Data_ID },
        },
        name: newStudent.name,
        lastname: newStudent.lastname,
      },
    });

    return createdStudent;
  }

  async createLoginData(
    newData: User_Login_DataDto,
    prisma: PrismaClient,
  ): Promise<User_Login_Data> {
    try {
      return await prisma.user_Login_Data.create({
        data: {
          email: newData.email,
          password: newData.password,
          role: 'Student',
        },
      });
    } catch (err) {
      //if student with the email already exists, throw exception
      throw new HttpException(
        'user with email ' + newData.email + ' already exists!',
        HttpStatus.CONFLICT,
      );
    }
  }
}

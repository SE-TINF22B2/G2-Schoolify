import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Student } from '@prisma/client';

@Injectable()
export class StudentService {
  async getStudent(
    studentMail: string,
    prisma: PrismaClient,
  ): Promise<Student> {
    // get student logindata id
    const studentLoginData = await prisma.user_Login_Data.findUnique({
      where: {
        email: studentMail,
      },
      select: {
        user_Login_DataID: true,
        role: true,
      },
    });
    if (!studentLoginData || studentLoginData.role != 'Student') {
      throw new HttpException(
        'student with mail ' + studentMail + ' was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const studentLoginID = studentLoginData.user_Login_DataID;

    const student = await prisma.student.findUnique({
      where: {
        user_Login_DataUser_Login_DataID: studentLoginID,
      },
      select: {
        studentID: true,
        name: true,
        lastname: true,
        classClassID: true,
        Class: true,
        user_Login_DataUser_Login_DataID: true,
        grades: {
          select: {
            gradeID: true,
            grade: true,
            testTestID: false,
            Test: true,
            teacherTeacherID: false,
            Teacher: true,
            subjectSubjectID: false,
            Subject: true,
          },
        },
      },
    });
    // prisma statement returns undefined if no student was found, then an exception will be thrown
    return student;
  }
}

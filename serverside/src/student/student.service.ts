import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Student } from '@prisma/client';

@Injectable()
export class StudentService {
  async getStudent(id: number, prisma: PrismaClient): Promise<Student> {
    const student = await prisma.student.findUnique({
      where: {
        studentID: id,
      },
      select: {
        studentID: true,
        name: true,
        lastname: true,
        classClassID: true,
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
    if (!student)
      throw new HttpException(
        'student with id ' + id + ' was not found',
        HttpStatus.NOT_FOUND,
      );
    return student;
  }
}

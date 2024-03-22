import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Absent, Lesson, PrismaClient, Student } from '@prisma/client';

@Injectable()
export class AbsenceService {
  async getAbsences(lessonId: number, prisma: PrismaClient): Promise<Absent[]> {
    // get the lessons time first
    const lesson: Lesson = await this.getLesson(lessonId, prisma);
    const lessonTime = lesson.startTime;
    const classID = lesson.classClassID;

    // get all user login data ids which are students and belong to the class
    // -> student table: get all students with classID and only get user login data ID
    const students: Student[] = await this.getStudentsByClass(classID, prisma);

    const studentLoginIDs = students.map(
      (student) => student.user_Login_DataUser_Login_DataID,
    );
    // get absents where lessons start time is in range of absent and user login data id is part of given array
    const absents = await prisma.absent.findMany({
      where: {
        user_Login_DataUser_Login_DataID: {
          in: studentLoginIDs,
        },
      },
      include: {
        User_Login_Data: {
          select: {
            user_Login_DataID: false,
            email: false,
            password: false,
            role: false,
            Student: {
              select: {
                user_Login_DataUser_Login_DataID: false,
                classClassID: false,
                name: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    const filteredAbsents = absents.filter((absent) => {
      const startTime = new Date(absent.dateFrom);
      const endTime = new Date(absent.dateTo);

      return startTime <= lessonTime && lessonTime <= endTime;
    });
    return filteredAbsents;
  }

  async getLesson(lessonID: number, prisma: PrismaClient): Promise<Lesson> {
    const lesson: Lesson = await prisma.lesson.findUnique({
      where: {
        lessonID: lessonID,
      },
    });
    if (!lesson)
      throw new HttpException(
        'lesson with ID ' + lessonID + ' was not found',
        HttpStatus.NOT_FOUND,
      );
    return lesson;
  }
  async getStudentsByClass(
    classID: number,
    prisma: PrismaClient,
  ): Promise<Student[]> {
    const students = await prisma.student.findMany({
      where: {
        classClassID: classID,
      },
    });
    return students;
  }
}

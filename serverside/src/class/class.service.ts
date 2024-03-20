import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Class, PrismaClient } from '@prisma/client';
import { Create_Class_Dto } from 'dto/createClassDto';

@Injectable()
export class ClassService {
  // to-do: check if at least one student and one teacher was given
  async createClass(newClass: Create_Class_Dto, prisma: PrismaClient) {
    // check if teachers exists
    const teacherEmails = newClass.teachers.map((emailsDto) => emailsDto.email);
    if (!(await this.checkMails(teacherEmails, prisma))) {
      throw new HttpException(
        'One or more teacher were not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const teacherLoginIDs = await this.getUsersByEmail(teacherEmails, prisma);
    // check if teacher IDs are teachers
    if (!(await this.checkTeacher(teacherLoginIDs, prisma))) {
      throw new HttpException(
        'One ore more teacher mail is not a teacher',
        HttpStatus.NOT_FOUND,
      );
    }

    // check if students exists
    const studentEmails = newClass.students.map((emailsDto) => emailsDto.email);
    if (!(await this.checkMails(studentEmails, prisma))) {
      throw new HttpException(
        'One or more students were not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const studentIDs = await this.getUsersByEmail(studentEmails, prisma);

    // check if students are not assigned to a class already
    await this.checkStudents(studentIDs, newClass.roomNumber, prisma);

    // create class
    const createdClass: Class = await prisma.class.create({
      data: {
        roomNumber: newClass.roomNumber,
        letter: newClass.letter,
        year: newClass.year,
      },
    });

    // update classID of students
    await this.addStudentsToClass(studentIDs, createdClass.classID, prisma);

    // add classID to teacher
    const teacherIDs = await this.getRoleID(teacherLoginIDs, prisma);

    await prisma.$transaction(
      teacherIDs.map((teacherId) =>
        prisma.role.create({
          data: {
            Teacher: {
              connect: { teacherID: teacherId },
            },
            Class: {
              connect: { classID: createdClass.classID },
            },
          },
        }),
      ),
    );

    return createdClass;
  }

  async getClassByID(id: number, prisma: PrismaClient): Promise<Class> {
    return await prisma.class.findUnique({
      where: { classID: id },
    });
  }
  async getClassByYear(year: string, prisma: PrismaClient): Promise<Class[]> {
    return await prisma.class.findMany({
      where: {
        year: year,
      },
    });
  }

  private async addStudentsToClass(
    students: number[],
    classID: number,
    prisma: PrismaClient,
  ) {
    await prisma.student.updateMany({
      where: {
        user_Login_DataUser_Login_DataID: {
          in: students,
        },
      },
      data: {
        classClassID: classID,
      },
    });
  }

  private async checkTeacher(
    teachers: number[],
    prisma: PrismaClient,
  ): Promise<boolean> {
    const foundTeacher = await prisma.teacher.findMany({
      where: {
        user_Login_DataUser_Login_DataID: {
          in: teachers,
        },
      },
    });
    return teachers.length === foundTeacher.length;
  }

  private async checkStudents(
    students: number[],
    classID: number,
    prisma: PrismaClient,
  ) {
    // check if every student is not assigned to a class already
    const foundStudentsWithClass = await prisma.student.findMany({
      where: {
        user_Login_DataUser_Login_DataID: {
          in: students,
        },
        classClassID: {
          not: null,
        },
      },
    });
    if (foundStudentsWithClass.length > 0) {
      throw new HttpException(
        'One or more student is already assigned to a class',
        HttpStatus.CONFLICT,
      );
    }
  }

  private async checkMails(
    emails: string[],
    prisma: PrismaClient,
  ): Promise<boolean> {
    const foundEmails = await prisma.user_Login_Data.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });
    // if found emails are less than given emails, at least one email is missing
    return emails.length === foundEmails.length;
  }
  private async getUsersByEmail(
    emails: string[],
    prisma: PrismaClient,
  ): Promise<number[]> {
    const users = await prisma.user_Login_Data.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        user_Login_DataID: true, // Only select id field
      },
    });
    return users.map((user) => user.user_Login_DataID);
  }
  private async getRoleID(
    login_ID: number[],
    prisma: PrismaClient,
  ): Promise<number[]> {
    const users = await prisma.teacher.findMany({
      where: {
        user_Login_DataUser_Login_DataID: {
          in: login_ID,
        },
      },
      select: {
        teacherID: true, // Only select id field
      },
    });
    return users.map((user) => user.teacherID);
  }
}

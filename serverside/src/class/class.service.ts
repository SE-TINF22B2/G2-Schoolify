import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Class, PrismaClient } from '@prisma/client';
import {
  Create_Class_Dto,
  UpdateStudentsDto,
  UpdateTeacherDto,
} from 'dto/createClassDto';

@Injectable()
export class ClassService {
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

    // add teacher to class
    await this.addTeacherToClass(teacherIDs, createdClass.classID, prisma);

    return createdClass;
  }

  async getClassByID(id: number, prisma: PrismaClient): Promise<Class> {
    return await prisma.class.findUnique({
      where: { classID: id },
      include: {
        students: true,
        teachers: true,
      },
    });
  }
  async getClassByYear(year: string, prisma: PrismaClient): Promise<Class[]> {
    return await prisma.class.findMany({
      where: {
        year: year,
      },
      include: {
        students: true,
        teachers: true,
      },
    });
  }
  async assignStudents(
    newStudents: UpdateStudentsDto,
    classID: number,
    prisma: PrismaClient,
  ): Promise<Class> {
    // check if class exists
    if (!(await this.checkClass(classID, prisma))) {
      throw new HttpException(
        'class with ID ' + classID + ' not found',
        HttpStatus.NOT_FOUND,
      );
    }
    //check if given emails exist
    const emails = newStudents.students.map((emailsDto) => emailsDto.email);
    if (!(await this.checkMails(emails, prisma))) {
      throw new HttpException(
        'One or more students were not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // get student IDs
    const studentIDs = await this.getUsersByEmail(emails, prisma);

    // assign students
    await this.addStudentsToClass(studentIDs, classID, prisma);

    // return new class
    return await prisma.class.findUnique({
      where: {
        classID: classID,
      },
      include: {
        students: true,
        teachers: true,
      },
    });
  }
  async assignTeacher(
    newTeachers: UpdateTeacherDto,
    classID: number,
    prisma: PrismaClient,
  ): Promise<Class> {
    // check if class exists
    if (!(await this.checkClass(classID, prisma))) {
      throw new HttpException(
        'class with ID ' + classID + ' not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // check if teachers exists
    const teacherEmails = newTeachers.teachers.map(
      (emailsDto) => emailsDto.email,
    );
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

    // assign teacher
    await this.addTeacherToClass(teacherLoginIDs, classID, prisma);

    // get new class and return it
    return await prisma.class.findUnique({
      where: {
        classID: classID,
      },
      include: {
        students: true,
        teachers: true,
      },
    });
  }

  async checkClass(classID: number, prisma: PrismaClient): Promise<boolean> {
    const classCount = await prisma.class.count({
      where: {
        classID: classID,
      },
    });
    return classCount === 1;
  }

  async addStudentsToClass(
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
  async addTeacherToClass(
    teacherIDs: number[],
    classID: number,
    prisma: PrismaClient,
  ) {
    await prisma.$transaction(
      teacherIDs.map((teacherId) =>
        prisma.role.create({
          data: {
            Teacher: {
              connect: { teacherID: teacherId },
            },
            Class: {
              connect: { classID: classID },
            },
          },
        }),
      ),
    );
  }

  async checkTeacher(
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

  async checkStudents(
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

  async checkMails(emails: string[], prisma: PrismaClient): Promise<boolean> {
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
  async getUsersByEmail(
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
        user_Login_DataID: true
      },
    });
    return users.map((user) => user.user_Login_DataID);
  }
  async getRoleID(login_ID: number[], prisma: PrismaClient): Promise<number[]> {
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

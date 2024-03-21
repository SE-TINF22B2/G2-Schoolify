import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Grade } from '@prisma/client';
import { SaveGradeDto } from 'dto/saveGradeDto';

@Injectable()
export class GradeService {
  async saveGrade(
    newGrade: SaveGradeDto,
    prisma: PrismaClient,
  ): Promise<Grade> {
    const student = await prisma.student.findFirst({
      where: {
        studentID: newGrade.studentID,
      },
    });
    const teacher = await prisma.teacher.findFirst({
      where: {
        teacherID: newGrade.teacherID,
      },
    });
    if (!student) {
      throw new HttpException(
        'Student ' + newGrade.studentID + ' does not exist!',
        HttpStatus.CONFLICT,
      );
    }
    if (!teacher) {
      throw new HttpException(
        'Teacher ' + newGrade.teacherID + ' does not exist!',
        HttpStatus.CONFLICT,
      );
    }
    //Subject überhaupt dem Student assigned
    //ist Lehrer überhaupt der Lehrer
    //--> neue user stories

    const grade: Grade = await prisma.grade.create({
      data: {
        grade: newGrade.grade,
        testTestID: newGrade.testID,
        studentStudentID: newGrade.studentID,
        teacherTeacherID: newGrade.teacherID,
        subjectSubjectID: newGrade.subjectID,
      },
    });
    return grade;
  }

  async getGradesByStudentID(
    studentId: number,
    prisma: PrismaClient,
  ): Promise<Grade[]> {
    let grade: Grade[];

    //secure database request
    try {
      grade = await prisma.grade.findMany({
        where: {
          studentStudentID: studentId,
        },
      });
    } catch (e) {
      console.log(e);
    }

    if (!grade || grade.length < 1) {
      throw new NotFoundException('Grade not found');
    }
    return grade;
  }

  async getGradesByTestID(
    testId: number,
    prisma: PrismaClient,
  ): Promise<Grade[]> {
    let grade: Grade[];

    //secure database request
    try {
      grade = await prisma.grade.findMany({
        where: {
          testTestID: testId,
        },
      });
    } catch (e) {
      console.log(e);
    }

    if (!grade || grade.length < 1) {
      throw new NotFoundException('Grade not found');
    }
    return grade;
  }
}

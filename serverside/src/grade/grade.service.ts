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
    if (!student) doesNotExist('Student', newGrade.studentID);

    const teacher = await prisma.teacher.findFirst({
      where: {
        teacherID: newGrade.teacherID,
      },
    });
    if (!teacher) doesNotExist('Teacher', newGrade.teacherID);
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
    const grade: Grade[] = await prisma.grade.findMany({
      where: {
        studentStudentID: studentId,
      },
    });

    if (!grade || grade.length < 1) {
      throw new NotFoundException('Grade not found');
    }
    return grade;
  }

  async getGradesByTestID(
    testId: number,
    prisma: PrismaClient,
  ): Promise<Grade[]> {
    const grade: Grade[] = await prisma.grade.findMany({
      where: {
        testTestID: testId,
      },
    });

    if (!grade || grade.length < 1) {
      throw new NotFoundException('Grade not found');
    }
    return grade;
  }
}

function doesNotExist(entity, name) {
  throw new HttpException(
    entity + ' ' + name + ' does not exist!',
    HttpStatus.CONFLICT,
  );
}

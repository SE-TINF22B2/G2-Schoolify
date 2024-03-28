import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Get,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { SaveGradeDto } from '../../dto/saveGradeDto';
// .../grade/

@Controller('grade')
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}
  @Post('save')
  async saveGrade(
    @Headers('role') role,
    @Body() grade: SaveGradeDto,
  ): Promise<any> {
    if (role !== 'Teacher') {
      throw new HttpException(
        role + ' is not allowed to save grades!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.gradeService.saveGrade(grade, this.prisma);
  }

  @Get(':studentId')
  async getGradesByStudentID(
    @Headers('id') userId: number,
    @Body('studentId') studentId: number,
  ) {
    if (userId !== studentId) {
      throw new HttpException(
        userId + ' is not allowed to see the grades from ' + studentId + '!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.gradeService.getGradesByStudentID(studentId, this.prisma);
  }

  @Get(':testId')
  async getGradesByTestID(
    @Headers('role') role,
    @Body('id') testId: number,
  ): Promise<any> {
    if (role !== 'Teacher' && role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to see the grades!',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.gradeService.getGradesByTestID(testId, this.prisma);
  }
}

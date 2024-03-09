import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Teacher, Prisma } from '@prisma/client';
import { CreateTeacherDto } from './dto/createTeacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async teacher(
    teacherWhereUniqueInput: Prisma.TeacherWhereUniqueInput,
  ): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: teacherWhereUniqueInput,
    });
  }

  async teachers(): Promise<Teacher[]> {
    return this.prisma.teacher.findMany();
  }

  async createTeacher(data: Teacher): Promise<Teacher | null> {
    return this.prisma.teacher.create({
      data,
    });
  }
}

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

  async createTeacher(passedData: CreateTeacherDto): Promise<Teacher | null> {
    return this.prisma.teacher.create({
      data: {
        user_Login_DataUser_Login_DataID: passedData.user_Login_DataID,
        name: passedData.name,
        lastname: passedData.lastname,
      },
    });
  }

  async patchTeacher(id: number, data: string): Promise<Teacher | null> {
    try {
      return this.patchTeacher(id, data);
    } catch (error) {
      return error;
    }
  }

  async deleteTeacher(id: number): Promise<string> {
    return `Deleted teacher with ID ${id}`;
  }
}

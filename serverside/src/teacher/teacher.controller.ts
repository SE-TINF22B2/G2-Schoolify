import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from '@prisma/client';
import { CreateTeacherDto } from './dto/createTeacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('id/:id')
  findOne(@Param('id') id: string): Promise<Teacher | null> {
    const teacher = this.teacherService.teacher({ teacherID: Number(id) });
    if (teacher != null) {
      return teacher;
    } else {
      return null;
    }
  }

  @Get('')
  findMany(): Promise<Teacher[]> {
    return this.teacherService.teachers();
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  create(@Body() data: CreateTeacherDto): Promise<Teacher | null> {
    const response = this.teacherService.createTeacher(data);
    if (response != null) {
      return response;
    } else {
      return null;
    }
  }

  @Patch('id/:id')
  patch(@Param() id: number, @Body() data: string): Promise<Teacher | null> {
    try {
      return this.teacherService.patchTeacher(id, data);
    } catch (error) {
      return error;
    }
  }

  @Delete('id/:id')
  delete(@Param() id: number): Promise<string> {
    try {
      return this.teacherService.deleteTeacher(id);
    } catch (error) {
      return error;
    }
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from '@prisma/client';
import { CreateTeacherDto } from './dto/createTeacher.dto';
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('id/:id')
  findOne(@Param('id') id: string): Promise<Teacher | null> {
    return this.teacherService.teacher({ teacherID: Number(id) });
  }

  @Get('all')
  findMany(): Promise<Teacher[]> {
    return this.teacherService.teachers();
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  create(@Body() data: CreateTeacherDto): Promise<Teacher | null> {
    return this.teacherService.createTeacher(data);
  }
}

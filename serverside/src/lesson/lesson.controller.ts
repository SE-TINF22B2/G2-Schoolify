import { Controller, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get, Param } from '@nestjs/common';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  @Get(':classId/week/:weekNumber')
  getAllLessonsForClassInWeek(
    @Headers('role') role,
    @Param('classID') classId: number,
    @Param('weekStart') weekNumber: number,
  ) {
    // Your code to fetch all lessons for a certain class in a week goes here
  }
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {}

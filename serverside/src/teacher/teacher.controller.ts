import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {}

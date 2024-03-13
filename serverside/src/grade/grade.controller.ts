import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Grade')
@Controller('grade')
export class GradeController {}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Meal')
@Controller('meal')
export class MealController {}

import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateStudentDto } from 'dto/createStudentDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  createStudent(
    @Headers('role') role,
    @Body() newStudent: CreateStudentDto,
  ): any {
    if (role !== 'Admin') {
      throw new HttpException(
        role + ' is not allowed to create a new student',
        HttpStatus.FORBIDDEN,
      );
    } else {
      return this.userService.createUser(newStudent);
    }
  }
}

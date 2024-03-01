import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'dto/createStudentDto';
// import { Student } from '@prisma/client';
@Injectable()
export class UsersService {
  validateInput(newStudent: any): any {
    // const name = newStudent.name;
    // const lastname = newStudent.lastname;
    // const classID = newStudent.classID;
    // const class = newStudent.class;
    return newStudent;
  }
  createUser(newStudent: CreateStudentDto): any {
    // first validate input to be correct
    // const newStudent = this.validateInput(body);



    return newStudent;
  }
}

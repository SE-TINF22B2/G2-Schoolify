import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User_Login_DataDto } from 'dto/loginDTO';

@Injectable()
export class AuthService {
  async logIn(
    newLogin: User_Login_DataDto,
    prisma: PrismaClient,
  ): Promise<boolean> {
    const student = await prisma.user_Login_Data.findUnique({
      where: {
        email: newLogin.email,
      },
    });
    //Student with email given?
    if (!student) throwEmailNotFound(newLogin.email);
    //Check for password
    if (student.password !== newLogin.password) {
      throwWrongPassword(newLogin.email);
    }
    return true;
  }
}

function throwEmailNotFound(email) {
  throw new HttpException(
    `User with email ${email} is not registered. Please check your input or ask the admin.`,
    HttpStatus.NOT_FOUND,
  );
}
function throwWrongPassword(email) {
  throw new HttpException(
    `Password for User with the email ${email} is wrong. Please try again or press 'Forgot password'`,
    HttpStatus.BAD_REQUEST,
  );
}

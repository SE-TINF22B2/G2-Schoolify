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
    if (!student || student.password !== newLogin.password) {
      throwNotFound();
    }
    return true;
  }
}

function throwNotFound() {
  throw new HttpException(
    'Either the User does not exist or the password is wrong. Please try again!',
    HttpStatus.BAD_REQUEST,
  );
}

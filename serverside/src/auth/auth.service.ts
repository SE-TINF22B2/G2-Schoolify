import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    { email, password }: AuthPayloadDto,
    prisma: PrismaClient,
  ): Promise<{ access_token: string }> {
    // user mit anhand email finden
    const findUser = await prisma.user_Login_Data.findUnique({
      where: {
        email: email,
      },
    });

    // hash mash
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    // user existiert nicht oder passwort falsch
    if (!findUser || !(await bcrypt.compare(findUser.password, hash))) {
      throw new UnauthorizedException();
    }

    //payload für jwt
    const payload = {
      sub: findUser.user_Login_DataID,
      email: findUser.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: 'abc123',
    });
  }
  async setCookies(response: any, email: string, token: string, prisma: PrismaClient) {
    if(this.validateToken(token)) {
      response.cookie('session', token);
      const user = await prisma.user_Login_Data.findUnique({
        where: {
          email: email,
        },
      });
      response.cookie('role', user.role);
      if(user.role === 'Student') {
        const student = await prisma.student.findUnique({
          where: {
            user_Login_DataUser_Login_DataID: user.user_Login_DataID,
          },
        });
        response.cookie('classID', student.classClassID);
      }
    }

  }
}

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
    const findUser = prisma.user_Login_Data.findUnique({
      where: {
        email: email,
      },
    });

    // hash mash
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    // user existiert nicht oder passwort falsch
    if (!findUser || !(await bcrypt.compare((await findUser).password, hash))) {
      throw new UnauthorizedException();
    }

    //payload für jwt
    const payload = {
      sub: (await findUser).user_Login_DataID,
      email: (await findUser).email,
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
}

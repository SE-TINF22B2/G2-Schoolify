import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUser = [
  {
    id: 1,
    email: 'test1@test.de',
    password: 'test',
  },
  {
    id: 2,
    email: 'test2@test.de',
    password: 'test',
  },
  {
    id: 3,
    email: 'test3@test.de',
    password: 'test',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<{ access_token: string }> {
    const findUser = fakeUser.find((user) => user.email === email);

    if (!findUser || findUser.password != password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: findUser.id,
      email: findUser.email,
      password: findUser.password,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { User_Login_DataDto } from '../../dto/loginDTO';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}
  @Post('logIn')
  async logIn(@Body() loginData: User_Login_DataDto): Promise<boolean> {
    return await this.authService.logIn(loginData, this.prisma);
  }
}

import { ApiTags } from '@nestjs/swagger';
import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma, PrismaClient } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}
}

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { Prisma, PrismaClient } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>,
  ) {}

  @Post('login')
  @ApiOkResponse({ description: 'Access Token', type: String })
  async login(@Body() authPayload: AuthPayloadDto): Promise<any> {
    return await this.authService.validateUser(authPayload, this.prisma);
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './tokens/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'abc123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: 'PRISMA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    AuthService,
    {
      provide: 'PRIMSA',
      useValue: new PrismaClient(),
    },
  ],
  controllers: [AuthController],
  imports: [UsersModule, TokensModule],
})
export class AuthModule {}

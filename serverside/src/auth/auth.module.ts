import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, TokensModule],
})
export class AuthModule {}

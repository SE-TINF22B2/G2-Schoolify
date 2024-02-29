import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';

@Module({
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}

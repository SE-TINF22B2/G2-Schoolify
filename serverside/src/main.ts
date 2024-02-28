import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function primsaEnvDefinition() {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env.development' });
    //here
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('No DATABASE_URL specified in environment variables.');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
primsaEnvDefinition();
bootstrap();

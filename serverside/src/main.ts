import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as dotenv from 'dotenv';

async function primsaEnvDefinition() {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env.development' });
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('No DATABASE_URL specified in environment variables.');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Schoolify API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
  console.log(`Application is running on: 3000`);
  //Global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
}
primsaEnvDefinition();
bootstrap();

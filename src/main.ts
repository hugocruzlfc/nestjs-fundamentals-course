import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard, HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unwanted properties
      forbidNonWhitelisted: true, // throw an error if unwanted properties are present
      transform: true, // transform the incoming data to the correct type
      transformOptions: {
        enableImplicitConversion: true, // convert string to number, etc.
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new ApiKeyGuard());
  app.setGlobalPrefix('ilovecoffee');
  await app.listen(3000);
}
bootstrap();

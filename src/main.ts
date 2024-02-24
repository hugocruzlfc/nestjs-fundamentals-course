import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ApiKeyGuard,
  HttpExceptionFilter,
  TimeoutInterceptor,
  WrapResponseInterceptor,
} from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  // app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  app.setGlobalPrefix('ilovecoffee');

  const options = new DocumentBuilder()
    .setTitle('Coffee')
    .setDescription('The coffee API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

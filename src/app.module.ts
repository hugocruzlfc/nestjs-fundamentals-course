import { Module, ValidationPipe } from '@nestjs/common';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './libs';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common';

@Module({
  imports: [
    // TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forRootAsync({
      useFactory: () => TypeOrmConfig,
    }),
    ConfigModule.forRoot({
      // isGlobal: true,
      // envFilePath: '.env',
      //ignoreEnvFile: true,
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5432),
      // }),
      load: [appConfig],
    }),
    CoffeesModule,
    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
  ],
  controllers: [],
  // providers: [
  //   {
  //     provide: APP_PIPE,
  //     useValue: ValidationPipe,
  //   },
  // ],
})
export class AppModule {}

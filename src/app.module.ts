import { Module } from '@nestjs/common';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './libs';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import appConfig from './config/app.config';

@Module({
  imports: [
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
    TypeOrmModule.forRoot(TypeOrmConfig),
    CoffeeRatingModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

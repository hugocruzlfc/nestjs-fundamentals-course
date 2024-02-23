import { Module } from '@nestjs/common';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './libs';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      // envFilePath: '.env',
      ignoreEnvFile: true,
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

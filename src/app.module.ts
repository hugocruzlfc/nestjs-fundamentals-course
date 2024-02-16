import { Module } from '@nestjs/common';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './libs';

@Module({
  imports: [CoffeesModule, TypeOrmModule.forRoot(TypeOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}

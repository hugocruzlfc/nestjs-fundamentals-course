import { SchemaSync1708775558842 } from 'src/migrations/1708775558842-SchemaSync';
import { Coffee, Flavor } from './src/coffees/entities';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ilovecoffee',
  entities: [Coffee, Flavor],
  migrations: [SchemaSync1708775558842],
});

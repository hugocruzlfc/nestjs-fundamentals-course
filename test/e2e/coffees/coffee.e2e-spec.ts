import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesModule } from '../../../src/coffees/coffees.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto, UpdateCoffeeDto } from 'src/coffees/dto';

describe('[Feature] Coffees -/coffees', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'ilovecoffee_test',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedPartialCoffee);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };
    return request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updateCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

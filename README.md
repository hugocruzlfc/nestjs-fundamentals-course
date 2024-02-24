<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes on the project

### commands

```bash
nest g co modules/abc --dry-run
```

### For Validate Pipes

```bash
npm i class-validator class-transformer
```

### For extend class with PartialType

```bash
npm i @nestjs/mapped-types
```

### Add TYPEORM

```bash
npm install @nestjs/typeorm typeorm pg
```

### Create the migration

```bash
npx typeorm migration:create src/migrations/CoffeeRefactor
```

### Run the migration

```bash
npx typeorm migration:run -d dist/typeorm-cli.config
```

### Revert the migration

```bash
npx typeorm migration:revert -d dist/typeorm-cli.config
```

### Generate the migration

```bash
npx typeorm migration:create src/migrations/SchemaSync -d dist/typeorm-cli.config
```

### Generate filter

```bash
nest g filter common/filters/http-exception
```

### Generate guard

```bash
nest g guard common/guards/api-key
```

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1708625872432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `AlTER TABLE "coffee" ADD COLUMN "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`AlTER TABLE "coffee" DROP COLUMN "description"`);
  }
}

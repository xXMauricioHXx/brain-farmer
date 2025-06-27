import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCropsTable1751027257524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tb_crops (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        harvest_year INT NOT NULL,
        farm_id UUID NOT NULL,

        CONSTRAINT fk_farm FOREIGN KEY (farm_id) REFERENCES tb_farms(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tb_crops;`);
  }
}

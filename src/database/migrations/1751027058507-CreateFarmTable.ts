import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarmTable1751027058507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tb_farms (
        id UUID PRIMARY KEY,
        producer_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        total_area NUMERIC(18,6) NOT NULL,
        agriculture_area NUMERIC(18,6) NOT NULL,
        vegetation_area NUMERIC(18,6) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP,

        CONSTRAINT fk_producer FOREIGN KEY (producer_id) REFERENCES tb_rural_producers(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tb_farms;`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRuralProducerTable1751026945429
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tb_rural_producers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        document VARCHAR(14) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_rural_producers_document ON tb_rural_producers(document);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_rural_producers_document;`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS rural_producers;`);
  }
}

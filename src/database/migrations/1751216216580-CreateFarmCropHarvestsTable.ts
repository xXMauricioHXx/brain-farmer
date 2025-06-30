import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHarvestCropTable1751216216580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tb_farm_crop_harvests (
        id UUID PRIMARY KEY,
        farm_id UUID NOT NULL,
        crop_id UUID NOT NULL,
        harvest_id UUID NOT NULL,
        planted_area NUMERIC(18, 6) NOT NULL,
        harvest_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP,
        
        CONSTRAINT fk_farm FOREIGN KEY (farm_id) REFERENCES tb_farms(id),
        CONSTRAINT fk_crop FOREIGN KEY (crop_id) REFERENCES tb_crops(id),
        CONSTRAINT fk_harvest FOREIGN KEY (harvest_id) REFERENCES tb_harvests(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tb_farm_crop_harvests;`);
  }
}

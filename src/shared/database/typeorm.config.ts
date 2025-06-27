import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { FarmModel } from './models/farm.model';
import { CropModel } from './models/crop.model';
import { RuralProducerModel } from './models/rural-producer.model';

export const typeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [RuralProducerModel, FarmModel, CropModel],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrations: ['src/shared/database/migrations/*.ts'],
});

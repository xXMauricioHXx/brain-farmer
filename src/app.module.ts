import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { FarmModule } from './modules/farms/farm.module';
import { CropModule } from './modules/crops/crop.module';
import typeormPostgresConfig from './database/config/typeorm.env';
import { HarvestModule } from './modules/harvests/harvest.module';
import { RuralProducerModule } from './modules/rural-producers/rural-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeormPostgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>(
          'typeorm'
        ) as TypeOrmModuleOptions,
    }),
    FarmModule,
    CropModule,
    HarvestModule,
    RuralProducerModule,
  ],
})
export class AppModule {}

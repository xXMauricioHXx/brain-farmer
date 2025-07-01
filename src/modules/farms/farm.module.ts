import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  FARM_REPOSITORY,
  HARVEST_REPOSITORY,
  CROP_REPOSITORY,
} from '@/shared/tokens';
import { CropModule } from '@/crops/crop.module';
import { FarmModel } from '@/database/models/farm.model';
import { CropModel } from '@/database/models/crop.model';
import { HarvestModel } from '@/database/models/harvest.model';
import { FarmService } from '@/farms/application/services/farm.service';
import { RuralProducerModule } from '@/rural-producers/rural-producer.module';
import { FarmController } from '@/farms/application/controllers/farm.controller';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmRepository } from '@/farms/infrastructure/repositories/farm.repository';
import { FarmCropHarvestService } from '@/farms/application/services/farm-crop-harvest.service';
import { FarmCropHarvestController } from '@/farms/application/controllers/farm-crop-harvest.controller';
import { HarvestModule } from '@/harvests/harvest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FarmModel,
      CropModel,
      FarmCropHarvestModel,
      HarvestModel,
    ]),
    CropModule,
    RuralProducerModule,
    HarvestModule,
  ],
  controllers: [FarmController, FarmCropHarvestController],
  providers: [
    FarmService,
    FarmCropHarvestService,
    { provide: FARM_REPOSITORY, useClass: FarmRepository },
  ],
  exports: [],
})
export class FarmModule {}

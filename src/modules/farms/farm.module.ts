import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { CropModel } from '@/database/models/crop.model';
import {
  CROP_REPOSITORY,
  FARM_REPOSITORY,
  HARVEST_REPOSITORY,
} from '@/shared/tokens';
import { HarvestModel } from '@/database/models/harvest.model';
import { FarmService } from '@/farms/application/services/farm.service';
import { RuralProducerModule } from '@/rural-producers/rural-producer.module';
import { FarmController } from '@/farms/application/controllers/farm.controller';
import { FarmCropService } from '@/farms/application/services/farm-crop.service';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmRepository } from '@/farms/infrastructure/repositories/farm.repository';
import { CropRepository } from '@/farms/infrastructure/repositories/crop.repository';
import { HarvestRepository } from '@/farms/infrastructure/repositories/harvest.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FarmModel,
      CropModel,
      FarmCropHarvestModel,
      HarvestModel,
    ]),
    RuralProducerModule,
  ],
  controllers: [FarmController],
  providers: [
    FarmService,
    FarmCropService,
    { provide: FARM_REPOSITORY, useClass: FarmRepository },
    { provide: CROP_REPOSITORY, useClass: CropRepository },
    { provide: HARVEST_REPOSITORY, useClass: HarvestRepository },
  ],
  exports: [],
})
export class FarmModule {}

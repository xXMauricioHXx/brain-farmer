import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CROP_REPOSITORY } from '@/shared/tokens';
import { CropModel } from '@/database/models/crop.model';
import { CropService } from './application/services/crop.service';
import { CropController } from './application/controllers/crop.controller';
import { CropRepository } from './infrastructure/repositories/crop.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';

@Module({
  imports: [TypeOrmModule.forFeature([CropModel, FarmCropHarvestModel])],
  controllers: [CropController],
  providers: [
    CropService,
    { provide: CROP_REPOSITORY, useClass: CropRepository },
  ],
  exports: [{ provide: CROP_REPOSITORY, useClass: CropRepository }],
})
export class CropModule {}

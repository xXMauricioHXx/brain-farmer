import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CROP_REPOSITORY } from '@/shared/tokens';
import { CropModel } from '@/database/models/crop.model';
import { CropService } from './application/services/crop.service';
import { CropController } from './application/controllers/crop.controller';
import { CropRepository } from './infrastructure/repositories/crop.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CropModel])],
  controllers: [CropController],
  providers: [
    CropService,
    { provide: CROP_REPOSITORY, useClass: CropRepository },
  ],
  exports: [],
})
export class CropModule {}

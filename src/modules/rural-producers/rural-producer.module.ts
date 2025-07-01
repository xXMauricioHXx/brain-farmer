import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { RURAL_PRODUCER_REPOSITORY } from '@/shared/tokens';
import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { RuralProducerService } from './application/services/rural-producer.service';
import { RuralProducerController } from './application/controllers/rural-producer.controller';
import { RuralProducerRepository } from './infrastructure/repositories/rural-producer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RuralProducerModel,
      FarmCropHarvestModel,
      FarmModel,
    ]),
  ],

  controllers: [RuralProducerController],
  providers: [
    RuralProducerService,
    {
      provide: RURAL_PRODUCER_REPOSITORY,
      useClass: RuralProducerRepository,
    },
  ],
  exports: [
    {
      provide: RURAL_PRODUCER_REPOSITORY,
      useClass: RuralProducerRepository,
    },
  ],
})
export class RuralProducerModule {}

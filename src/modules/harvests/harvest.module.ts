import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HARVEST_REPOSITORY } from '@/shared/tokens';
import { HarvestModel } from '@/database/models/harvest.model';
import { HarvestService } from '@/harvests/application/services/harvest.service';
import { HarvestController } from '@/harvests/application/controllers/harvest.controller';
import { HarvestRepository } from '@/harvests/infrastructure/repositories/harvest.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HarvestModel])],
  controllers: [HarvestController],
  providers: [
    HarvestService,
    { provide: HARVEST_REPOSITORY, useClass: HarvestRepository },
  ],
  exports: [],
})
export class HarvestModule {}

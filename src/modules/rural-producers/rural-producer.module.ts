import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { RuralProducerService } from './application/services/rural-producer.service';
import { RuralProducerController } from './application/controllers/rural-producer.controller';
import { RuralProducerRepository } from './infrastructure/repositories/rural-producer.repository';
import { RURAL_PRODUCER_REPOSITORY } from 'src/shared/tokens/repositories/rural-producer.repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([RuralProducerModel])],

  controllers: [RuralProducerController],

  providers: [
    RuralProducerService,
    {
      provide: RURAL_PRODUCER_REPOSITORY,
      useClass: RuralProducerRepository,
    },
  ],
})
export class RuralProducerModule {}

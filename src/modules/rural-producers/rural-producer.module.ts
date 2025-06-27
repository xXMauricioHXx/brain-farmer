import { Module } from '@nestjs/common';
import { RuralProducerController } from './application/controllers/rural-producer.controller';

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [RuralProducerController],
})
export class RuralProducerModule {}

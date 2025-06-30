import { Body, Controller, Get, Post } from '@nestjs/common';

import { RuralProducerService } from '@/rural-producers/application/services/rural-producer.service';
import { ListRuralProducerOutput } from '@/rural-producers/application/dtos/list-rural-producer.dto';
import { CreateRuralProducerInput } from '@/rural-producers/application/dtos/create-rural-producer.dto';

@Controller('rural-producers')
export class RuralProducerController {
  constructor(private readonly ruralProducerService: RuralProducerService) {}

  @Post()
  async create(@Body() data: CreateRuralProducerInput) {
    return this.ruralProducerService.create(data);
  }

  @Get()
  async list(): Promise<ListRuralProducerOutput[]> {
    return this.ruralProducerService.list();
  }
}

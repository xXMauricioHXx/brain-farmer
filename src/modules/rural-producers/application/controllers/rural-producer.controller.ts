import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRuralProducerInput } from '../dtos/create-rural-producer.dto';
import { RuralProducerService } from '../services/rural-producer.service';
import { ListRuralProducerOutput } from '../dtos/list-rural-producer.dto';

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

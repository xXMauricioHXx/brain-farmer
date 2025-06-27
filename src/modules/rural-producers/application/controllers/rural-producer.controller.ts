import { Body, Controller, Post } from '@nestjs/common';
import { CreateRuralProducerDTO } from '../dtos/create-rural-producer.dto';

@Controller('rural-producers')
export class RuralProducerController {
  @Post()
  async create(@Body() data: CreateRuralProducerDTO) {
    return 'Hello world, ' + data.name;
  }
}

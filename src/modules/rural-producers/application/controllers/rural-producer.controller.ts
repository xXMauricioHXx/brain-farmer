import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { RuralProducerService } from '@/rural-producers/application/services/rural-producer.service';
import { ListRuralProducerOutput } from '@/rural-producers/application/dtos/list-rural-producer.dto';
import { CreateRuralProducerInput } from '@/rural-producers/application/dtos/create-rural-producer.dto';
import { UpdateRuralProducerInput } from '@/rural-producers/application/dtos/update-rural-producer.dto';
import { FindRuralProducerByIdOutput } from '@/rural-producers/application/dtos/find-rural-producer-by-id.dto';

@Controller('rural-producers')
export class RuralProducerController {
  constructor(private readonly ruralProducerService: RuralProducerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateRuralProducerInput) {
    return this.ruralProducerService.create(data);
  }

  @Get()
  async list(): Promise<ListRuralProducerOutput[]> {
    return this.ruralProducerService.list();
  }

  @Get('/:id')
  async findById(
    @Param('id') id: string
  ): Promise<FindRuralProducerByIdOutput> {
    return this.ruralProducerService.findById(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRuralProducerInput
  ): Promise<void> {
    return this.ruralProducerService.update(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.ruralProducerService.delete(id);
  }
}

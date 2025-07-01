import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { HarvestService } from '@/harvests/application/services/harvest.service';
import { CreateHarvestInput } from '@/harvests/application/dtos/create-harvest.dto';

@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() input: CreateHarvestInput) {
    return this.harvestService.create(input);
  }

  @Get()
  list() {
    return this.harvestService.list();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.harvestService.findById(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() input: CreateHarvestInput) {
    return this.harvestService.update(id, input);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.harvestService.delete(id);
  }
}

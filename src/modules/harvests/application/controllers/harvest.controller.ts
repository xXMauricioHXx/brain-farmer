import { Body, Controller, Get, Post } from '@nestjs/common';

import { HarvestService } from '@/harvests/application/services/harvest.service';
import { CreateHarvestInput } from '@/harvests/application/dtos/create-harvest.dto';

@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  create(@Body() input: CreateHarvestInput) {
    return this.harvestService.create(input);
  }

  @Get()
  list() {
    return this.harvestService.list();
  }
}

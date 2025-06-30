import {
  Get,
  Body,
  Post,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { FarmService } from '@/farms/application/services/farm.service';
import { CreateFarmInput, CreateFarmOutput } from '../dtos/create-farm.dto';
import { AddCropsToFarmInput } from '@/farms/application/dtos/add-crops-to-farm';
import { FarmCropService } from '@/farms/application/services/farm-crop.service';

@Controller('farms')
export class FarmController {
  constructor(
    private readonly farmService: FarmService,
    private readonly farmCropService: FarmCropService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFarmInput): Promise<CreateFarmOutput> {
    return this.farmService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list() {
    return this.farmService.list();
  }

  @Post('/:farmId/crops')
  @HttpCode(HttpStatus.CREATED)
  async addCropsToFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Body() input: AddCropsToFarmInput
  ) {
    return this.farmCropService.assignCropsToFarm(farmId, input.crops);
  }
}

import {
  Body,
  Post,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';

import { AddCropsToFarmInput } from '@/farms/application/dtos/add-crops-to-farm';
import { FarmCropHarvestService } from '@/farms/application/services/farm-crop-harvest.service';

@Controller('farms/:farmId/crop-harvests')
export class FarmCropHarvestController {
  constructor(
    private readonly farmCropHarvestService: FarmCropHarvestService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addCropsToFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Body() input: AddCropsToFarmInput
  ) {
    return this.farmCropHarvestService.assignCropsToFarm(farmId, input.crops);
  }

  @Delete('/:farmCropHarvestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Param('farmCropHarvestId', new ParseUUIDPipe()) farmCropHarvestId: string
  ): Promise<void> {
    return this.farmCropHarvestService.delete(farmId, farmCropHarvestId);
  }
}

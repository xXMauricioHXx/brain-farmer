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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ADD_CROPS_TO_FARM_OK,
  CROP_NOT_FOUND,
  DELETE_FARM_CROP_HARVEST_OK,
  FARM_AREA_EXCEEDS_LIMIT,
  FARM_CROP_HARVEST_NOT_FOUND,
  HARVEST_NOT_FOUND,
} from '../dtos/examples/farm-crop-harvest.example';
import { FARM_NOT_FOUND } from '../dtos/examples/farm-response.example';

@ApiTags('Farms Crop Harvests')
@Controller('farms/:farmId/crop-harvests')
export class FarmCropHarvestController {
  constructor(
    private readonly farmCropHarvestService: FarmCropHarvestService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona culturas a uma fazenda' })
  @ApiResponse(ADD_CROPS_TO_FARM_OK)
  @ApiResponse(FARM_NOT_FOUND)
  @ApiResponse(CROP_NOT_FOUND)
  @ApiResponse(HARVEST_NOT_FOUND)
  @ApiResponse(FARM_AREA_EXCEEDS_LIMIT)
  @HttpCode(HttpStatus.CREATED)
  async addCropsToFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Body() input: AddCropsToFarmInput
  ) {
    return this.farmCropHarvestService.assignCropsToFarm(farmId, input.crops);
  }

  @Delete('/:farmCropHarvestId')
  @ApiOperation({ summary: 'Remove uma cultura de uma fazenda' })
  @ApiResponse(DELETE_FARM_CROP_HARVEST_OK)
  @ApiResponse(FARM_NOT_FOUND)
  @ApiResponse(FARM_CROP_HARVEST_NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Param('farmCropHarvestId', new ParseUUIDPipe()) farmCropHarvestId: string
  ): Promise<void> {
    return this.farmCropHarvestService.delete(farmId, farmCropHarvestId);
  }
}

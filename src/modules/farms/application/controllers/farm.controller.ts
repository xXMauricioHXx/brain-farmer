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
  Put,
  Delete,
} from '@nestjs/common';

import {
  CreateFarmInput,
  CreateFarmOutput,
} from '@/farms/application/dtos/create-farm.dto';
import { FarmService } from '@/farms/application/services/farm.service';
import { ListFarmsOutput } from '@/farms/application/dtos/list-farms.dto';
import { UpdateFarmInput } from '@/farms/application/dtos/update-farm.dto';

@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFarmInput): Promise<CreateFarmOutput> {
    return this.farmService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<ListFarmsOutput[]> {
    return this.farmService.list();
  }

  @Get('/:farmId')
  async findById(
    @Param('farmId', new ParseUUIDPipe()) farmId: string
  ): Promise<ListFarmsOutput> {
    return this.farmService.findById(farmId);
  }

  @Put('/:farmId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string,
    @Body() dto: UpdateFarmInput
  ): Promise<void> {
    return this.farmService.update(farmId, dto);
  }

  @Delete('/:farmId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFarm(
    @Param('farmId', new ParseUUIDPipe()) farmId: string
  ): Promise<void> {
    return this.farmService.delete(farmId);
  }
}

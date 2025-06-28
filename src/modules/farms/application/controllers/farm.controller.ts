import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { FarmService } from '../services/farm.service';
import { CreateFarmInput, CreateFarmOutput } from '../dtos/create-farm.dto';

@Controller('farms')
export class RuralProducerController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFarmInput): Promise<CreateFarmOutput> {
    return this.farmService.create(dto);
  }
}

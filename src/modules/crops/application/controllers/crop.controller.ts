import { Body, Controller, Get, Post } from '@nestjs/common';

import { CropService } from '@/crops/application/services/crop.service';
import { CreateCropInput } from '@/crops/application/dtos/create-crop.dto';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  async create(@Body() input: CreateCropInput) {
    return this.cropService.create(input);
  }

  @Get()
  async list() {
    return this.cropService.findAll();
  }
}

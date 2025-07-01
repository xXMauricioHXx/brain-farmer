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

import { CropService } from '@/crops/application/services/crop.service';
import {
  CreateCropInput,
  CreateCropOutput,
} from '@/crops/application/dtos/create-crop.dto';
import { ListCropsOutput } from '@/crops/application/dtos/list-crops.dto';
import { FindCropByIdOutput } from '@/crops/application/dtos/find-crop-by-id.dto';

@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() input: CreateCropInput): Promise<CreateCropOutput> {
    return this.cropService.create(input);
  }

  @Get()
  async list(): Promise<ListCropsOutput[]> {
    return this.cropService.findAll();
  }

  @Get('/:id')
  async findById(@Body('id') id: string): Promise<FindCropByIdOutput> {
    return this.cropService.findById(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body('id') id: string,
    @Body() input: CreateCropInput
  ): Promise<void> {
    return this.cropService.update(id, input);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.cropService.delete(id);
  }
}

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
import { ListCropOutput } from '@/crops/application/dtos/list-crop.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PARAM_ID_EXAMPLE } from '../../../../shared/examples/param-id.example';
import {
  CREATE_CROP_OK,
  CROP_NOT_FOUND,
  FIND_CROPS_BY_ID_OK,
  UPDATE_CROP_OK,
} from '../dtos/examples/crop-response.example';

@ApiTags('Crops')
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova cultura agrícola' })
  @ApiResponse(CREATE_CROP_OK)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() input: CreateCropInput): Promise<CreateCropOutput> {
    return this.cropService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Lista culturas agrícolas' })
  @ApiResponse({ status: HttpStatus.OK, type: [ListCropOutput] })
  @HttpCode(HttpStatus.OK)
  async list(): Promise<ListCropOutput[]> {
    return this.cropService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lista cultura agrícola por ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(FIND_CROPS_BY_ID_OK)
  @ApiResponse(CROP_NOT_FOUND)
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<ListCropOutput> {
    return this.cropService.findById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza cultura agrícola por ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiBody({ type: CreateCropInput })
  @ApiResponse(UPDATE_CROP_OK)
  @ApiResponse(CROP_NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() input: CreateCropInput
  ): Promise<void> {
    return this.cropService.update(id, input);
  }

  @Delete('/:id')
  @ApiParam(PARAM_ID_EXAMPLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta cultura agrícola por ID' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.cropService.delete(id);
  }
}

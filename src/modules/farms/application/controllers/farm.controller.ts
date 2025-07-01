import {
  Get,
  Body,
  Put,
  Post,
  Query,
  Param,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  CreateFarmInput,
  CreateFarmOutput,
} from '@/farms/application/dtos/create-farm.dto';
import { FarmService } from '@/farms/application/services/farm.service';
import {
  ListFarmsInput,
  ListFarmsOutput,
} from '@/farms/application/dtos/list-farms.dto';
import { PARAM_ID_EXAMPLE } from '@/shared/examples/param-id.example';
import { UpdateFarmInput } from '@/farms/application/dtos/update-farm.dto';
import { PaginatedQueryOutput } from '@/shared/repositories/dtos/paginated-query.dto';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  LIST_FARMS_OK,
  CREATE_FARM_OK,
  FARM_NOT_FOUND,
  UPDATE_FARM_OK,
  DELETE_FARM_OK,
  FARM_INVALID_AREA,
  FIND_FARM_BY_ID_OK,
} from '@/farms/application/dtos/examples/farm-response.example';

@ApiTags('Farms')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova fazenda' })
  @ApiResponse(CREATE_FARM_OK)
  @ApiResponse(FARM_INVALID_AREA)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFarmInput): Promise<CreateFarmOutput> {
    return this.farmService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista as fazendas com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'state', required: false, example: 'RS' })
  @ApiResponse(LIST_FARMS_OK)
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: ListFarmsInput
  ): Promise<PaginatedQueryOutput<ListFarmsOutput>> {
    return this.farmService.listPaginated(query);
  }

  @Get('/:id')
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiOperation({ summary: 'Busca uma fazenda pelo ID' })
  @ApiResponse(FIND_FARM_BY_ID_OK)
  @ApiResponse(FARM_NOT_FOUND)
  async findById(
    @Param('id', new ParseUUIDPipe()) farmId: string
  ): Promise<ListFarmsOutput> {
    return this.farmService.findById(farmId);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza uma fazenda existente' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(FARM_NOT_FOUND)
  @ApiResponse(UPDATE_FARM_OK)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFarm(
    @Param('id', new ParseUUIDPipe()) farmId: string,
    @Body() dto: UpdateFarmInput
  ): Promise<void> {
    return this.farmService.update(farmId, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deleta uma fazenda' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(DELETE_FARM_OK)
  @ApiResponse(FARM_NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFarm(
    @Param('id', new ParseUUIDPipe()) farmId: string
  ): Promise<void> {
    return this.farmService.delete(farmId);
  }
}

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

import { HarvestService } from '@/harvests/application/services/harvest.service';
import {
  CreateHarvestInput,
  CreateHarvestOutput,
} from '@/harvests/application/dtos/create-harvest.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListHarvestsOutput } from '../dtos/list-harvests.dto';
import { PARAM_ID_EXAMPLE } from '@/shared/examples/param-id.example';
import {
  CREATE_HARVEST_OK,
  DELETE_HARVEST_OK,
  FIND_HARVEST_BY_ID_OK,
  HARVEST_NOT_FOUND,
  UPDATE_HARVEST_OK,
} from '../dtos/examples/harvest-response.example';

@ApiTags('Harvests')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova safra (harvest)' })
  @ApiBody({ type: CreateHarvestInput })
  @ApiResponse(CREATE_HARVEST_OK)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() input: CreateHarvestInput): Promise<CreateHarvestOutput> {
    return this.harvestService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as safras' })
  @ApiResponse({ status: 200, type: [ListHarvestsOutput] })
  list(): Promise<ListHarvestsOutput[]> {
    return this.harvestService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma safra pelo ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(FIND_HARVEST_BY_ID_OK)
  @ApiResponse(HARVEST_NOT_FOUND)
  findById(@Param('id') id: string): Promise<ListHarvestsOutput> {
    return this.harvestService.findById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza uma safra pelo ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(HARVEST_NOT_FOUND)
  @ApiBody({ type: CreateHarvestInput })
  @ApiResponse(UPDATE_HARVEST_OK)
  update(
    @Param('id') id: string,
    @Body() input: CreateHarvestInput
  ): Promise<void> {
    return this.harvestService.update(id, input);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove uma safra pelo ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(DELETE_HARVEST_OK)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.harvestService.delete(id);
  }
}

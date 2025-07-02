import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { RuralProducerService } from '@/rural-producers/application/services/rural-producer.service';
import { ListRuralProducerOutput } from '@/rural-producers/application/dtos/list-rural-producer.dto';
import {
  CreateRuralProducerInput,
  CreateRuralProducerOutput,
} from '@/rural-producers/application/dtos/create-rural-producer.dto';
import { UpdateRuralProducerInput } from '@/rural-producers/application/dtos/update-rural-producer.dto';
import { PARAM_ID_EXAMPLE } from '@/shared/examples/param-id.example';
import {
  INVALID_DOCUMENT,
  CREATE_RURAL_PRODUCER_OK,
  DELETE_RURAL_PRODUCER_OK,
  FIND_RURAL_PRODUCER_BY_ID_OK,
  LIST_RURAL_PRODUCER_OK,
  RURAL_PRODUCER_NOT_FOUND,
  UPDATE_RURAL_PRODUCER_OK,
} from '@/rural-producers/application/dtos/examples/rural-producer-response.example';

@ApiTags('Rural Producers')
@Controller('rural-producers')
export class RuralProducerController {
  constructor(private readonly ruralProducerService: RuralProducerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo produtor rural' })
  @ApiBody({ type: CreateRuralProducerInput })
  @ApiResponse(INVALID_DOCUMENT)
  @ApiResponse(CREATE_RURAL_PRODUCER_OK)
  async create(
    @Body() data: CreateRuralProducerInput
  ): Promise<CreateRuralProducerOutput> {
    return this.ruralProducerService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtores rurais' })
  @ApiResponse(LIST_RURAL_PRODUCER_OK)
  async list(): Promise<ListRuralProducerOutput[]> {
    return this.ruralProducerService.list();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Busca um produtor rural por ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(FIND_RURAL_PRODUCER_BY_ID_OK)
  @ApiResponse(RURAL_PRODUCER_NOT_FOUND)
  async findById(@Param('id') id: string): Promise<ListRuralProducerOutput> {
    return this.ruralProducerService.findById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualiza o nome de um produtor rural' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiBody({ type: UpdateRuralProducerInput })
  @ApiResponse(UPDATE_RURAL_PRODUCER_OK)
  @ApiResponse(RURAL_PRODUCER_NOT_FOUND)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRuralProducerInput
  ): Promise<void> {
    return this.ruralProducerService.update(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um produtor rural por ID' })
  @ApiParam(PARAM_ID_EXAMPLE)
  @ApiResponse(RURAL_PRODUCER_NOT_FOUND)
  @ApiResponse(DELETE_RURAL_PRODUCER_OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.ruralProducerService.delete(id);
  }
}

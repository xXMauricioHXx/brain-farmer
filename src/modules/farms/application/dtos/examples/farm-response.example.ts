import { HttpStatus } from '@nestjs/common';
import { CreateFarmOutput } from '../create-farm.dto';
import { PaginatedQueryOutput } from '@/shared/repositories/dtos/paginated-query.dto';
import { ListFarmsOutput } from '../list-farms.dto';

export const CREATE_FARM_OK = {
  status: HttpStatus.CREATED,
  description: 'Fazenda criada com sucesso',
  type: CreateFarmOutput,
};

export const UPDATE_FARM_OK = {
  status: HttpStatus.NO_CONTENT,
  description: 'Fazenda atualizada com sucesso',
};

export const DELETE_FARM_OK = {
  status: HttpStatus.NO_CONTENT,
  description: 'Fazenda deletada com sucesso',
};

export const LIST_FARMS_OK = {
  status: HttpStatus.OK,
  description: 'Lista paginada de fazendas',
  type: PaginatedQueryOutput,
};

export const FIND_FARM_BY_ID_OK = {
  status: HttpStatus.OK,
  description: 'Detalhes da fazenda',
  type: ListFarmsOutput,
};

export const FARM_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Rural producer not found',
};

export const RURAL_PRODUCER_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Rural producer not found.',
};

export const FARM_INVALID_AREA = {
  status: 422,
  error: 'Unprocessable Entity',
  message:
    'Invalid areas: agriculture (100-) + vegetation (200) exceeds total area (1000)',
};

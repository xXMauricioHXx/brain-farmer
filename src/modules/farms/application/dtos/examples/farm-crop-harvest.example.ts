import { HttpStatus } from '@nestjs/common';
import { ListFarmsOutput } from '@/farms/application/dtos/list-farms.dto';

export const ADD_CROPS_TO_FARM_OK = {
  status: HttpStatus.CREATED,
  description: 'Culturas adicionadas à fazenda com sucesso',
  type: ListFarmsOutput,
};

export const DELETE_FARM_CROP_HARVEST_OK = {
  status: HttpStatus.NO_CONTENT,
  description: 'Relacionamento entre fazenda e cultura deletado com sucesso',
};

export const FARM_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Farm not found.',
};

export const CROP_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Crop not found.',
};

export const HARVEST_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Harvest not found.',
};

export const FARM_AREA_EXCEEDS_LIMIT = {
  status: 422,
  error: 'Unprocessable Entity',
  message:
    'Invalid areas: agriculture (1000) + vegetation (200) exceeds total area (1000)',
};

export const FARM_CROP_HARVEST_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Farm crop harvest not found.',
};

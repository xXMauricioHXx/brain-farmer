import { ApiResponseOptions } from '@nestjs/swagger';
import { CreateRuralProducerOutput } from '../create-rural-producer.dto';
import { ListRuralProducerOutput } from '../list-rural-producer.dto';

export const CREATE_RURAL_PRODUCER_OK = {
  status: 201,
  type: CreateRuralProducerOutput,
};

export const LIST_RURAL_PRODUCER_OK = {
  status: 200,
  type: [ListRuralProducerOutput],
} as ApiResponseOptions;

export const FIND_RURAL_PRODUCER_BY_ID_OK = {
  status: 200,
  type: ListRuralProducerOutput,
};

export const UPDATE_RURAL_PRODUCER_OK = {
  status: 204,
  description: 'Atualizado com sucesso',
};

export const DELETE_RURAL_PRODUCER_OK = {
  status: 204,
  description: 'Removido com sucesso',
};

export const RURAL_PRODUCER_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Rural producer not found',
};

export const INVALID_DOCUMENT = {
  status: 400,
  error: 'Bad Request',
  message: 'Unable to process request',
};

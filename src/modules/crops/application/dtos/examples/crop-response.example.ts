import { HttpStatus } from '@nestjs/common';
import { CreateCropOutput } from '../create-crop.dto';
import { ListCropOutput } from '../list-crop.dto';

export const CREATE_CROP_OK = {
  status: HttpStatus.CREATED,
  type: CreateCropOutput,
};

export const FIND_CROPS_BY_ID_OK = {
  status: HttpStatus.OK,
  type: ListCropOutput,
};

export const CROP_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Crop not found',
};

export const UPDATE_CROP_OK = {
  status: HttpStatus.NO_CONTENT,
  description: 'Plantação atualizada com sucesso.',
};

import { CreateHarvestOutput } from '../create-harvest.dto';
import { ListHarvestsOutput } from '../list-harvests.dto';

export const CREATE_HARVEST_OK = { status: 201, type: CreateHarvestOutput };

export const LIST_HARVESTS_OK = { status: 200, type: [ListHarvestsOutput] };

export const FIND_HARVEST_BY_ID_OK = { status: 200, type: ListHarvestsOutput };

export const HARVEST_NOT_FOUND = {
  status: 404,
  error: 'Not Found',
  message: 'Harvest not found',
};

export const UPDATE_HARVEST_OK = {
  status: 204,
  description: 'Harvest updated successfully.',
};

export const DELETE_HARVEST_OK = {
  status: 204,
  description: 'Remoção bem-sucedida',
};

import { CreateHarvestOutput } from '../create-harvest.dto';
import { ListHarvestsOutput } from '../list-harvests.dto';

export const CREATE_HARVEST_OK = { status: 201, type: CreateHarvestOutput };

export const LIST_HARVESTS_OK = { status: 200, type: [ListHarvestsOutput] };

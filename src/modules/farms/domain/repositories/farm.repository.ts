import { Farm } from '@/farms/domain/entities/farm.entity';
import { ListFarmsInput } from '@/farms/application/dtos/list-farms.dto';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';

export interface IFarmRepository {
  findAll(): Promise<Farm[]>;
  create(farm: Farm): Promise<Farm>;
  update(farm: Farm): Promise<void>;
  softDelete(id: string): Promise<void>;
  findById(id: string): Promise<Farm | null>;
  assignCropsToFarm(farm: Farm, crops: FarmCropHarvest[]): Promise<Farm>;
  deleteFarmCropHarvest(farmCropHarvestId): Promise<void>;
  findFarmCropHarvestById(id: string): Promise<FarmCropHarvest | null>;
  findPaginated(input: ListFarmsInput): Promise<[Farm[], number]>;
}

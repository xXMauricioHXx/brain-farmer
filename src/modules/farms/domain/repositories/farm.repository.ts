import { Crop } from '../entities/crop.entity';
import { Farm } from '../entities/farm.entity';

export interface IFarmRepository {
  create(farm: Farm): Promise<Farm>;
  findAll(): Promise<Farm[]>;
  findById(id: string): Promise<Farm | null>;
  assignCropsToFarm(farm: Farm, crops: Crop[]): Promise<Farm>;
}

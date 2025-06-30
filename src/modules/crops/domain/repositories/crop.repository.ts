import { Crop } from '../entities/crop.entity';

export interface ICropRepository {
  create(crop: Crop): Promise<Crop>;
  findAll(): Promise<Crop[]>;
}

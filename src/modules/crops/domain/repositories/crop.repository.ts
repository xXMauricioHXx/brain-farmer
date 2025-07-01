import { Crop } from '../entities/crop.entity';

export interface ICropRepository {
  create(crop: Crop): Promise<Crop>;
  findAll(): Promise<Crop[]>;
  findById(id: string): Promise<Crop | null>;
  update(crop: Crop): Promise<Crop>;
  softDelete(id: string): Promise<void>;
}

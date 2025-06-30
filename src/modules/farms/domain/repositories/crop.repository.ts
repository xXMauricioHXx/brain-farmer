import { Crop } from '../entities/crop.entity';

export interface ICropRepository {
  findById(id: string): Promise<Crop | null>;
}

import { Harvest } from '@/farms/domain/entities/harvest.entity';

export interface IHarvestRepository {
  findById(id: string): Promise<Harvest | null>;
}

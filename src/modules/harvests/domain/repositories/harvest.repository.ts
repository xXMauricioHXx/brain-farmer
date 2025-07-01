import { Harvest } from '@/harvests/domain/entities/harvest.entity';

export interface IHarvestRepository {
  create(harvest: Harvest): Promise<Harvest>;
  findAll(): Promise<Harvest[]>;
  findById(id: string): Promise<Harvest | null>;
  update(harvest: Harvest): Promise<void>;
  softDelete(id: string): Promise<void>;
}

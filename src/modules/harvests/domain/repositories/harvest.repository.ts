import { Harvest } from '@/harvests/domain/entities/harvest.entity';

export interface IHarvestRepository {
  create(harvest: Harvest): Promise<Harvest>;
  findAll(): Promise<Harvest[]>;
}

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/farms/domain/entities/harvest.entity';
import { IHarvestRepository } from '@/farms/domain/repositories/harvest.repository';

export class HarvestRepository implements IHarvestRepository {
  constructor(
    @InjectRepository(HarvestModel)
    private readonly repository: Repository<HarvestModel>
  ) {}

  async findById(id: string): Promise<Harvest | null> {
    const harvest = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!harvest) {
      return null;
    }

    return Harvest.instance({
      id: harvest.id,
      year: harvest.year,
      createdAt: harvest.createdAt,
    });
  }
}

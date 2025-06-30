import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/harvests/domain/entities/harvest.entity';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';

@Injectable()
export class HarvestRepository implements IHarvestRepository {
  constructor(
    @InjectRepository(HarvestModel)
    private readonly repository: Repository<HarvestModel>
  ) {}

  public async create(harvest: Harvest): Promise<Harvest> {
    const createdHarvest = this.repository.create({
      id: harvest.id,
      year: harvest.year,
    });

    const newHarvest = await this.repository.save(createdHarvest);

    return Harvest.instance(newHarvest);
  }

  async findAll(): Promise<Harvest[]> {
    const results = await this.repository.find({
      where: { deletedAt: null },
    });

    return results.map(result =>
      Harvest.instance({
        id: result.id,
        year: result.year,
        createdAt: result.createdAt,
      })
    );
  }
}

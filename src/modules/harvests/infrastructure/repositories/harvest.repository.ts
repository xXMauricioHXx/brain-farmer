import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/harvests/domain/entities/harvest.entity';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';

@Injectable()
export class HarvestRepository implements IHarvestRepository {
  constructor(
    @InjectRepository(HarvestModel)
    private readonly repository: Repository<HarvestModel>,
    @InjectRepository(FarmCropHarvestModel)
    private readonly farmCropHarvestRepository: Repository<FarmCropHarvestModel>
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

  async findById(id: string): Promise<Harvest | null> {
    const result = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!result) return null;

    return Harvest.instance({
      id: result.id,
      year: result.year,
      createdAt: result.createdAt,
    });
  }

  async update(harvest: Harvest): Promise<void> {
    await this.repository.update(harvest.id, {
      year: harvest.year,
      updatedAt: new Date(),
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.farmCropHarvestRepository.manager.transaction(
      async transaction => {
        await transaction.softDelete(FarmCropHarvestModel, { harvestId: id });
        await transaction.softDelete(HarvestModel, id);
      }
    );
  }
}

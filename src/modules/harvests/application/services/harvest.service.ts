import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateHarvestInput,
  CreateHarvestOutput,
} from '@/harvests/application/dtos/create-harvest.dto';
import { HARVEST_REPOSITORY } from '@/shared/repositories/tokens';
import { Harvest } from '@/harvests/domain/entities/harvest.entity';
import { ListHarvestsOutput } from '@/harvests/application/dtos/list-harvests.dto';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';

@Injectable()
export class HarvestService {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository
  ) {}

  async create(input: CreateHarvestInput): Promise<CreateHarvestOutput> {
    const harvest = Harvest.instance({
      id: uuidv4(),
      year: input.year,
    });

    return this.harvestRepository.create(harvest);
  }

  async list(): Promise<ListHarvestsOutput[]> {
    return this.harvestRepository.findAll();
  }

  async findById(id: string): Promise<ListHarvestsOutput> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException(`Harvest with id ${id} not found`);
    }

    return harvest;
  }

  async update(id: string, input: CreateHarvestInput): Promise<void> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException(`Harvest with id ${id} not found`);
    }

    harvest.year = input.year;

    return this.harvestRepository.update(harvest);
  }

  async delete(id: string): Promise<void> {
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException(`Harvest with id ${id} not found`);
    }

    return this.harvestRepository.softDelete(id);
  }
}

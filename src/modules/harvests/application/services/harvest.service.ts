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
import { logger } from '@/shared/logger/winston.logger';

@Injectable()
export class HarvestService {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository
  ) {}

  async create(input: CreateHarvestInput): Promise<CreateHarvestOutput> {
    logger.info(`Creating harvest for year: ${input.year}`);
    const harvest = Harvest.instance({
      id: uuidv4(),
      year: input.year,
    });

    return this.harvestRepository.create(harvest);
  }

  async list(): Promise<ListHarvestsOutput[]> {
    logger.info(`Listing all harvests`);
    return this.harvestRepository.findAll();
  }

  async findById(id: string): Promise<ListHarvestsOutput> {
    logger.info(`Finding harvest by ID: ${id}`);
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      logger.error(`Harvest with ID ${id} not found`);
      throw new NotFoundException(`Harvest not found`);
    }

    return harvest;
  }

  async update(id: string, input: CreateHarvestInput): Promise<void> {
    logger.info(`Updating harvest with ID: ${id}`);
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      logger.error(`Harvest with ID ${id} not found`);
      throw new NotFoundException(`Harvest not found`);
    }

    harvest.year = input.year;

    return this.harvestRepository.update(harvest);
  }

  async delete(id: string): Promise<void> {
    logger.info(`Deleting harvest with ID: ${id}`);
    const harvest = await this.harvestRepository.findById(id);

    if (!harvest) {
      logger.error(`Harvest with ID ${id} not found`);
      throw new NotFoundException(`Harvest not found`);
    }

    return this.harvestRepository.softDelete(id);
  }
}

import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';

import { Harvest } from '@/harvests/domain/entities/harvest.entity';
import { ListHarvestsOutput } from '@/harvests/application/dtos/list-harvests.dto';
import {
  CreateHarvestInput,
  CreateHarvestOutput,
} from '@/harvests/application/dtos/create-harvest.dto';
import { IHarvestRepository } from '@/modules/harvests/domain/repositories/harvest.repository';
import { HARVEST_REPOSITORY } from '@/shared/tokens';

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
}

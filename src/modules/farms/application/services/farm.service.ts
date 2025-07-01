import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  CreateFarmInput,
  CreateFarmOutput,
} from '@/farms/application/dtos/create-farm.dto';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { FarmMapper } from '@/farms/application/mappers/farm.mapper';
import {
  ListFarmsInput,
  ListFarmsOutput,
} from '@/farms/application/dtos/list-farms.dto';
import { UpdateFarmInput } from '@/farms/application/dtos/update-farm.dto';
import {
  FARM_REPOSITORY,
  RURAL_PRODUCER_REPOSITORY,
} from '@/shared/repositories/tokens';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { InvalidFarmAreaException } from '@/farms/domain/exceptions/invalid-farm-area.exception';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';
import { PaginatedQueryOutput } from '@/shared/repositories/dtos/paginated-query.dto';

@Injectable()
export class FarmService {
  private logger;

  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(RURAL_PRODUCER_REPOSITORY)
    private readonly ruralProducerRepository: IRuralProducerRepository
  ) {
    this.logger = new Logger(FarmService.name);
  }

  async create(input: CreateFarmInput): Promise<CreateFarmOutput> {
    try {
      const {
        name,
        city,
        state,
        ruralProducerId,
        totalArea,
        agricultureArea,
        vegetationArea,
      } = input;

      const foundRuralProducer =
        await this.ruralProducerRepository.checkExistsById(ruralProducerId);

      if (!foundRuralProducer) {
        throw new NotFoundException(`Rural producer not found.`);
      }

      const farm = Farm.instance({
        id: uuidv4(),
        name,
        city,
        state,
        ruralProducerId,
        totalArea: new Decimal(totalArea),
        vegetationArea: new Decimal(vegetationArea),
        agricultureArea: new Decimal(agricultureArea),
      });

      const createdFarm = await this.farmRepository.create(farm);

      return {
        id: createdFarm.id,
        name: createdFarm.name,
        totalArea: createdFarm.totalArea.toString(),
        agricultureArea: createdFarm.agricultureArea.toString(),
        vegetationArea: createdFarm.vegetationArea.toString(),
        state: createdFarm.state,
        city: createdFarm.city,
        ruralProducerId: createdFarm.ruralProducerId,
        createdAt: createdFarm.createdAt,
      };
    } catch (error) {
      this.logger.error(`Error creating farm: ${error.message}`, error.stack);

      if (error instanceof InvalidFarmAreaException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }

  async listPaginated(
    input: ListFarmsInput
  ): Promise<PaginatedQueryOutput<ListFarmsOutput>> {
    const [farms, total] = await this.farmRepository.findPaginated(input);

    return {
      items: farms.map(FarmMapper.entityToOutput),
      limit: input.limit,
      page: input.page,
      total,
    };
  }

  async findById(id: string): Promise<ListFarmsOutput> {
    const farm = await this.farmRepository.findById(id);

    if (!farm) {
      throw new NotFoundException(`Farm not found.`);
    }

    return FarmMapper.entityToOutput(farm);
  }

  async update(farmId: string, input: UpdateFarmInput): Promise<void> {
    const farm = await this.farmRepository.findById(farmId);

    if (!farm) {
      throw new NotFoundException(`Farm not found.`);
    }

    const { name, city, state, ruralProducerId } = input;

    farm.name = name || farm.name;
    farm.city = city || farm.city;
    farm.state = state || farm.state;
    farm.ruralProducerId = ruralProducerId || farm.ruralProducerId;

    await this.farmRepository.update(farm);
  }

  async delete(id: string): Promise<void> {
    const farm = await this.farmRepository.findById(id);

    if (!farm) {
      throw new NotFoundException(`Farm not found.`);
    }

    await this.farmRepository.softDelete(farm.id);
  }
}

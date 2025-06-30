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
import {
  CROP_REPOSITORY,
  FARM_REPOSITORY,
  RURAL_PRODUCER_REPOSITORY,
} from '@/shared/tokens';
import { Farm } from '../../domain/entities/farm.entity';
import { ListFarmsOutput } from '@/farms/application/dtos/list-farms.dto';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { ICropRepository } from '@/farms/domain/repositories/crop.repository';
import { InvalidDocumentException } from '@/farms/domain/exceptions/invalid-farm-area.exception';
import { IRuralProducerRepository } from '@/modules/rural-producers/domain/repositories/rural-producer.repository';

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
        throw new NotFoundException(
          `Rural producer with ID ${ruralProducerId} not found.`
        );
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

      if (error instanceof InvalidDocumentException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }

  async list(): Promise<ListFarmsOutput[]> {
    const farms = await this.farmRepository.findAll();

    return farms.map(farm => ({
      id: farm.id,
      name: farm.name,
      totalArea: farm.totalArea.toString(),
      agricultureArea: farm.agricultureArea.toString(),
      vegetationArea: farm.vegetationArea.toString(),
      state: farm.state,
      city: farm.city,
      ruralProducerId: farm.ruralProducerId,
      createdAt: farm.createdAt,
    }));
  }
}

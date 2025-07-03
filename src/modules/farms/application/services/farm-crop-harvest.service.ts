import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  CropToFarmInput,
  AddCropsToFarmOutput,
} from '@/farms/application/dtos/add-crops-to-farm';
import {
  CROP_REPOSITORY,
  FARM_REPOSITORY,
  HARVEST_REPOSITORY,
} from '@/shared/repositories/tokens';
import { FarmMapper } from '@/farms/application/mappers/farm.mapper';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';
import { PlantedAreaExceedsLimitException } from '@/farms/domain/exceptions/planted-area-exceeds-limit.exception';
import { logger } from '@/shared/logger/winston.logger';

@Injectable()
export class FarmCropHarvestService {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(CROP_REPOSITORY)
    private readonly cropRepository: ICropRepository,
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository
  ) {}

  async assignCropsToFarm(
    farmId: string,
    inputs: CropToFarmInput[]
  ): Promise<AddCropsToFarmOutput> {
    try {
      logger.info(
        `Assigning crops to farm with ID: ${farmId}, number of crops: ${inputs.length}`
      );
      const farm = await this.farmRepository.findById(farmId);

      if (!farm) {
        logger.error(`Farm with ID ${farmId} not found.`);
        throw new NotFoundException(`Farm not found.`);
      }

      const farmCropHarvests = await Promise.all(
        inputs.map(async input => {
          const { cropId, harvestDate, harvestId, plantedArea } = input;

          logger.info(
            `Processing crop ID: ${cropId}, harvest ID: ${harvestId}, harvest date: ${harvestDate}, planted area: ${plantedArea}`
          );
          const [crop, harvest] = await Promise.all([
            this.cropRepository.findById(cropId),
            this.harvestRepository.findById(harvestId),
          ]);

          if (!crop) {
            logger.error(`Crop with ID ${cropId} not found.`);
            throw new NotFoundException(`Crop not found.`);
          }

          if (!harvest) {
            logger.error(`Harvest with ID ${harvestId} not found.`);
            throw new NotFoundException(`Harvest not found.`);
          }

          const farmCropHarvest = FarmCropHarvest.instance({
            cropId: crop.id,
            harvestId: harvest.id,
            farmId: farm.id,
            harvestDate: harvestDate,
            name: crop.name,
          });
          logger.info(
            `Creating FarmCropHarvest for crop ID: ${crop.id}, harvest ID: ${harvest.id}`
          );

          farmCropHarvest.defineHarvestDate(harvestDate);
          farmCropHarvest.definePlantedArea(plantedArea);
          farmCropHarvest.assignHarvestYear(harvest.year);

          farm.validatePlantedAreaLimit(farmCropHarvest);

          return farmCropHarvest;
        })
      );

      logger.info(
        `Assigning ${farmCropHarvests.length} crops to farm with ID: ${farm.id}`
      );
      const assignedFarm = await this.farmRepository.assignCropsToFarm(
        farm,
        farmCropHarvests
      );

      return FarmMapper.entityToOutput(assignedFarm);
    } catch (error) {
      if (error instanceof PlantedAreaExceedsLimitException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }

  async delete(farmId: string, farmCropHarvestId: string): Promise<void> {
    logger.info(
      `Deleting farm crop harvest with ID: ${farmCropHarvestId} from farm with ID: ${farmId}`
    );
    const farm = await this.farmRepository.findById(farmId);

    if (!farm) {
      logger.error(`Farm with ID ${farmId} not found.`);
      throw new NotFoundException(`Farm not found.`);
    }

    const farmCropHarvest =
      await this.farmRepository.findFarmCropHarvestById(farmCropHarvestId);

    if (!farmCropHarvest) {
      logger.error(`Farm crop harvest with ID ${farmCropHarvestId} not found.`);
      throw new NotFoundException(`Farm crop harvest not found.`);
    }

    if (farmCropHarvest.farmId !== farmId) {
      logger.error(
        `Farm crop harvest with ID ${farmCropHarvestId} does not belong to farm with ID ${farmId}.`
      );
      throw new UnprocessableEntityException(
        `Farm crop harvest does not belong to farm.`
      );
    }

    return this.farmRepository.deleteFarmCropHarvest(farmCropHarvestId);
  }
}

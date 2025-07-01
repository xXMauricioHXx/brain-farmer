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
      const farm = await this.farmRepository.findById(farmId);

      if (!farm) {
        throw new NotFoundException(`Farm not found.`);
      }

      const farmCropHarvests = await Promise.all(
        inputs.map(async input => {
          const { cropId, harvestDate, harvestId, plantedArea } = input;

          const [crop, harvest] = await Promise.all([
            this.cropRepository.findById(cropId),
            this.harvestRepository.findById(harvestId),
          ]);

          if (!crop) {
            throw new NotFoundException(`Crop not found.`);
          }

          if (!harvest) {
            throw new NotFoundException(`Harvest not found.`);
          }

          const farmCropHarvest = FarmCropHarvest.instance({
            cropId: crop.id,
            harvestId: harvest.id,
            farmId: farm.id,
            harvestDate: harvestDate,
            name: crop.name,
          });

          farmCropHarvest.defineHarvestDate(harvestDate);
          farmCropHarvest.definePlantedArea(plantedArea);
          farmCropHarvest.assignHarvestYear(harvest.year);

          farm.validatePlantedAreaLimit(farmCropHarvest);

          return farmCropHarvest;
        })
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
    const farm = await this.farmRepository.findById(farmId);

    if (!farm) {
      throw new NotFoundException(`Farm not found.`);
    }

    const farmCropHarvest =
      await this.farmRepository.findFarmCropHarvestById(farmCropHarvestId);

    if (!farmCropHarvest) {
      throw new NotFoundException(`Farm crop harvest not found.`);
    }

    if (farmCropHarvest.farmId !== farmId) {
      throw new UnprocessableEntityException(
        `Farm crop harvest does not belong to farm.`
      );
    }

    return this.farmRepository.deleteFarmCropHarvest(farmCropHarvestId);
  }
}

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
} from '@/shared/tokens';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { ICropRepository } from '@/farms/domain/repositories/crop.repository';
import { IHarvestRepository } from '@/farms/domain/repositories/harvest.repository';
import { PlantedAreaExceedsLimitException } from '../../domain/exceptions/planted-area-exceeds-limit.exception';

@Injectable()
export class FarmCropService {
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
        throw new NotFoundException(`Farm with ID ${farmId} not found.`);
      }

      const crops = await Promise.all(
        inputs.map(async input => {
          const { cropId, harvestDate, harvestId, plantedArea } = input;

          const [crop, harvest] = await Promise.all([
            this.cropRepository.findById(cropId),
            this.harvestRepository.findById(harvestId),
          ]);

          if (!crop) {
            throw new NotFoundException(`Crop ${cropId} not found.`);
          }

          if (!harvest) {
            throw new NotFoundException(`Harvest ${harvestId} not found.`);
          }

          crop.defineHarvestDate(harvestDate);
          crop.definePlantedArea(plantedArea);
          crop.assignHarvest(harvest);

          farm.validatePlantedAreaLimit(crop);

          return crop;
        })
      );

      const result = await this.farmRepository.assignCropsToFarm(farm, crops);

      return {
        id: result.id,
        name: result.name,
        totalArea: result.totalArea.toString(),
        agricultureArea: result.agricultureArea.toString(),
        vegetationArea: result.vegetationArea.toString(),
        state: result.state,
        city: result.city,
        ruralProducerId: result.ruralProducerId,
        createdAt: result.createdAt,
        crops: result.crops.map(crop => ({
          id: crop.id,
          plantedArea: crop.plantedArea.toString(),
          harvestDate: crop.harvestDate,
          createdAt: crop.createdAt,
        })),
      };
    } catch (error) {
      if (error instanceof PlantedAreaExceedsLimitException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }
}

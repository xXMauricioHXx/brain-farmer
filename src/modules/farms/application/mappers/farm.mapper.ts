import { ListFarmsOutput } from '@/farms/application/dtos/list-farms.dto';
import { Farm } from '@/farms/domain/entities/farm.entity';

export class FarmMapper {
  static entityToOutput(data: Farm): ListFarmsOutput {
    return {
      id: data.id,
      name: data.name,
      totalArea: data.totalArea.toString(),
      agricultureArea: data.agricultureArea.toString(),
      vegetationArea: data.vegetationArea.toString(),
      state: data.state,
      city: data.city,
      ruralProducerId: data.ruralProducerId,
      createdAt: data.createdAt,
      crops: (data.farmCropHarvests || []).map(crop => ({
        name: crop.name,
        cropId: crop.cropId,
        harvestId: crop.harvestId,
        createdAt: crop.createdAt,
        harvestYear: crop.harvestYear,
        plantedArea: crop.plantedArea.toString(),
        harvestDate: crop.harvestDate,
        farmCropHarvestId: crop.farmCropHarvestId,
      })),
    };
  }
}

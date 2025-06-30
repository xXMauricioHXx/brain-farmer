import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { fa, faker } from '@faker-js/faker/.';

export class FarmCropHarvestFixture {
  public static createFarmCropHarvest(
    cropId?: string,
    farmId?: string,
    harvestId?: string
  ): FarmCropHarvestModel {
    const farmCropHarvestModel = new FarmCropHarvestModel();
    farmCropHarvestModel.id = faker.string.uuid();
    farmCropHarvestModel.farmId = farmId || faker.string.uuid();
    farmCropHarvestModel.cropId = cropId || faker.string.uuid();
    farmCropHarvestModel.harvestId = harvestId || faker.string.uuid();
    farmCropHarvestModel.plantedArea = faker.number
      .int({ min: 1, max: 1000 })
      .toString();
    farmCropHarvestModel.harvestDate = faker.date.past({ refDate: 5 });
    farmCropHarvestModel.createdAt = new Date();
    farmCropHarvestModel.updatedAt = new Date();
    farmCropHarvestModel.deletedAt = null;

    return farmCropHarvestModel;
  }
}

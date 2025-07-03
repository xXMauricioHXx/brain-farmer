import Decimal from 'decimal.js';
import { faker } from '@faker-js/faker/.';

import { CropModel } from '@/database/models/crop.model';
import { HarvestModel } from '@/database/models/harvest.model';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';

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
    farmCropHarvestModel.harvestDate = '2023-10-01';
    farmCropHarvestModel.createdAt = new Date();
    farmCropHarvestModel.updatedAt = new Date();
    farmCropHarvestModel.deletedAt = null;

    farmCropHarvestModel.crop = new CropModel();
    farmCropHarvestModel.crop.id = farmCropHarvestModel.cropId;
    farmCropHarvestModel.crop.name = faker.commerce.productName();
    farmCropHarvestModel.crop.createdAt = new Date();

    farmCropHarvestModel.harvest = new HarvestModel();
    farmCropHarvestModel.harvest.id = farmCropHarvestModel.harvestId;
    farmCropHarvestModel.harvest.year = faker.date.past().getFullYear();
    farmCropHarvestModel.harvest.createdAt = new Date();

    return farmCropHarvestModel;
  }

  public static entity(
    farmHarvestModel: FarmCropHarvestModel
  ): FarmCropHarvest {
    return FarmCropHarvest.instance({
      farmCropHarvestId: farmHarvestModel.id,
      name: farmHarvestModel.crop.name,
      farmId: farmHarvestModel.farmId,
      cropId: farmHarvestModel.cropId,
      harvestId: farmHarvestModel.harvestId,
      plantedArea: new Decimal(farmHarvestModel.plantedArea),
      harvestDate: farmHarvestModel.harvestDate,
      createdAt: farmHarvestModel.createdAt,
      harvestYear: farmHarvestModel.harvest.year,
    });
  }
}

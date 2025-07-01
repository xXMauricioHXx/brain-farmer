import { faker } from '@faker-js/faker';
import { Decimal } from 'decimal.js';

import { FarmModel } from '@/database/models/farm.model';
import { CropModel } from '@/database/models/crop.model';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { HarvestModel } from '@/database/models/harvest.model';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';

export class FarmFixture {
  public static createFarm(ruralProducerId?: string): FarmModel {
    const totalArea = faker.number.float({
      min: 10,
      max: 1000,
    });
    const agricultureArea = faker.number.float({
      min: 0,
      max: totalArea / 2,
    });
    const vegetationArea = faker.number.float({
      min: 0,
      max: totalArea - agricultureArea,
    });

    const farm = new FarmModel();
    farm.id = faker.string.uuid();
    farm.name = faker.location.city();
    farm.city = faker.location.city();
    farm.state = faker.location.state({ abbreviated: true });
    farm.totalArea = totalArea.toString();
    farm.agricultureArea = agricultureArea.toString();
    farm.vegetationArea = vegetationArea.toString();
    farm.ruralProducerId = ruralProducerId ?? faker.string.uuid();
    farm.createdAt = new Date();
    farm.updatedAt = new Date();
    farm.deletedAt = null;
    farm.farmCropHarvests = [];

    return farm;
  }

  public static createFarmWithCrops(farmCropHarvestLength?: number): FarmModel {
    const farmId = faker.string.uuid();
    const totalArea = faker.number.float({
      min: 100,
      max: 1000,
    });
    const agricultureArea = faker.number.float({
      min: 0,
      max: totalArea / 2,
    });
    const vegetationArea = faker.number.float({
      min: 0,
      max: totalArea - agricultureArea,
    });

    const farmCropHarvests = Array.from(
      { length: farmCropHarvestLength || 1 },
      () => {
        const harvestId = faker.string.uuid();

        const farmCropHarvestModel = new FarmCropHarvestModel();
        farmCropHarvestModel.id = faker.string.uuid();
        farmCropHarvestModel.farmId = farmId;
        farmCropHarvestModel.cropId = faker.string.uuid();
        farmCropHarvestModel.harvestId = harvestId;
        farmCropHarvestModel.plantedArea = faker.number
          .int({ min: 1, max: agricultureArea / 2 })
          .toString();
        farmCropHarvestModel.harvestDate = '2023-10-01';
        farmCropHarvestModel.createdAt = new Date();
        farmCropHarvestModel.harvest = new HarvestModel();
        farmCropHarvestModel.harvest.id = harvestId;
        farmCropHarvestModel.harvest.year = faker.number.int({
          min: 2000,
          max: 2040,
        });
        farmCropHarvestModel.harvest.createdAt = new Date();
        farmCropHarvestModel.crop = new CropModel();
        farmCropHarvestModel.crop.id = farmCropHarvestModel.cropId;
        farmCropHarvestModel.crop.name = faker.commerce.productName();
        farmCropHarvestModel.crop.createdAt = new Date();

        return farmCropHarvestModel;
      }
    );

    const farm = new FarmModel();
    farm.id = farmId;
    farm.name = faker.location.city();
    farm.city = faker.location.city();
    farm.state = faker.location.state({ abbreviated: true });
    farm.totalArea = totalArea.toString();
    farm.agricultureArea = agricultureArea.toString();
    farm.vegetationArea = vegetationArea.toString();
    farm.ruralProducerId = faker.string.uuid();
    farm.createdAt = new Date();
    farm.updatedAt = new Date();
    farm.deletedAt = null;
    farm.farmCropHarvests = farmCropHarvests;

    return farm;
  }

  public static entity(farm: FarmModel): Farm {
    return Farm.instance({
      ...farm,
      totalArea: new Decimal(farm.totalArea),
      agricultureArea: new Decimal(farm.agricultureArea),
      vegetationArea: new Decimal(farm.vegetationArea),
      farmCropHarvests: farm.farmCropHarvests.map(farmCropHarvest => {
        return FarmCropHarvest.instance({
          cropId: farmCropHarvest.cropId,
          name: farmCropHarvest.crop.name,
          harvestDate: farmCropHarvest.harvestDate,
          plantedArea: new Decimal(farmCropHarvest.plantedArea),
          harvestId: farmCropHarvest.harvestId,
          harvestYear: farmCropHarvest.harvest.year,
          farmCropHarvestId: farmCropHarvest.id,
          createdAt: farmCropHarvest.createdAt,
        });
      }),
    });
  }

  public static createManyFarms(
    count: number,
    producerId?: string
  ): FarmModel[] {
    return Array.from({ length: count }, () => this.createFarm(producerId));
  }

  public static createManyFarmsWithCrops(count: number): FarmModel[] {
    return Array.from({ length: count }, () => this.createFarmWithCrops());
  }

  public static farmCropHarvestEntity(
    farmCropHarvestModel: FarmCropHarvestModel
  ): FarmCropHarvest {
    return FarmCropHarvest.instance({
      cropId: farmCropHarvestModel.cropId,
      name: farmCropHarvestModel.crop.name,
      harvestId: farmCropHarvestModel.harvestId,
      harvestDate: farmCropHarvestModel.harvestDate,
      plantedArea: new Decimal(farmCropHarvestModel.plantedArea),
      harvestYear: farmCropHarvestModel.harvest.year,
      farmCropHarvestId: farmCropHarvestModel.id,
      createdAt: farmCropHarvestModel.createdAt,
      farmId: farmCropHarvestModel.farmId,
    });
  }
}

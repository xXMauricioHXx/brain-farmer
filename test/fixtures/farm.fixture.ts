import { faker } from '@faker-js/faker';
import { Decimal } from 'decimal.js';
import { FarmModel } from '@/database/models/farm.model';
import {
  Farm,
  FarmAttributes,
} from '@/modules/farms/domain/entities/farm.entity';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/farms/domain/entities/harvest.entity';
import { CropModel } from '@/database/models/crop.model';
import { Crop } from '@/farms/domain/entities/crop.entity';

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
          .int({ min: 1, max: 1000 })
          .toString();
        farmCropHarvestModel.harvestDate = new Date('2023-10-01');
        farmCropHarvestModel.createdAt = new Date();
        farmCropHarvestModel.harvest = new HarvestModel();
        farmCropHarvestModel.harvest.id = harvestId;
        farmCropHarvestModel.harvest.year = faker.number.int({
          min: 2000,
          max: 2040,
        });
        farmCropHarvestModel.harvest.createdAt = new Date();

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

  public static entity(data: FarmModel): Farm {
    return Farm.instance({
      ...data,
      totalArea: new Decimal(data.totalArea),
      agricultureArea: new Decimal(data.agricultureArea),
      vegetationArea: new Decimal(data.vegetationArea),
    });
  }

  public static createManyFarms(
    count: number,
    producerId?: string
  ): FarmModel[] {
    return Array.from({ length: count }, () => this.createFarm(producerId));
  }

  public static harvestEntity(harvestModel: HarvestModel) {
    return Harvest.instance({
      id: harvestModel.id,
      year: harvestModel.year,
      createdAt: harvestModel.createdAt,
    });
  }

  public static cropEntity(farmCropHarvestModel: FarmCropHarvestModel): Crop {
    return Crop.instance({
      id: farmCropHarvestModel.id,
      harvestDate: farmCropHarvestModel.harvestDate,
      plantedArea: new Decimal(farmCropHarvestModel.plantedArea),
      harvest: this.harvestEntity(farmCropHarvestModel.harvest),
      createdAt: farmCropHarvestModel.createdAt,
    });
  }
}

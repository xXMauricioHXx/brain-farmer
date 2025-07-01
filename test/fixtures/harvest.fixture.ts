import { faker } from '@faker-js/faker/.';

import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/harvests/domain/entities/harvest.entity';

export class HarvestFixture {
  public static createHarvest(id?: string, year?: number): HarvestModel {
    const harvestModel = new HarvestModel();
    harvestModel.id = id || faker.string.uuid();
    harvestModel.year = year || faker.number.int({ min: 2020, max: 2025 });
    harvestModel.createdAt = faker.date.past();

    return harvestModel;
  }

  public static entity(harvestModel: HarvestModel): Harvest {
    return Harvest.instance({
      id: harvestModel.id,
      year: harvestModel.year,
      createdAt: harvestModel.createdAt,
    });
  }

  public static createManyHarvest(count: number): HarvestModel[] {
    return Array.from({ length: count }, () => this.createHarvest());
  }
}

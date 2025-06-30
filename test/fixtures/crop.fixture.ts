import { faker } from '@faker-js/faker';
import { CropModel } from '@/database/models/crop.model';

export class CropFixture {
  public static createCrop(): CropModel {
    const crop = new CropModel();
    crop.id = faker.string.uuid();
    crop.name = faker.commerce.product();
    crop.createdAt = new Date();
    crop.updatedAt = new Date();
    crop.deletedAt = null;
    crop.farmCropHarvests = [];

    return crop;
  }

  public static createManyCrops(count: number): CropModel[] {
    return Array.from({ length: count }, () => this.createCrop());
  }
}

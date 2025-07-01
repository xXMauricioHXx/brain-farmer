import { faker } from '@faker-js/faker';
import { CropModel } from '@/database/models/crop.model';
import { Crop } from '@/crops/domain/entities/crop.entity';

export class CropFixture {
  public static createCrop(id?: string): CropModel {
    const crop = new CropModel();
    crop.id = id || faker.string.uuid();
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

  public static entity(cropModel: CropModel): Crop {
    return Crop.instance({
      id: cropModel.id,
      name: cropModel.name,
      createdAt: cropModel.createdAt,
    });
  }
}

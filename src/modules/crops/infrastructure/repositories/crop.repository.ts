import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Crop } from '@/crops/domain/entities/crop.entity';
import { CropModel } from '@/database/models/crop.model';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';

export class CropRepository implements ICropRepository {
  constructor(
    @InjectRepository(CropModel)
    private readonly repository: Repository<CropModel>,
    @InjectRepository(FarmCropHarvestModel)
    private readonly farmCropHarvestRepository: Repository<FarmCropHarvestModel>
  ) {}

  async create(crop: Crop): Promise<Crop> {
    const cropModel = this.repository.create({
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt,
    });

    const savedCrop = await this.repository.save(cropModel);
    return Crop.instance({
      id: savedCrop.id,
      name: savedCrop.name,
      createdAt: savedCrop.createdAt,
    });
  }

  async findAll(): Promise<Crop[]> {
    const crops = await this.repository.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
    });

    return crops.map(crop => {
      return Crop.instance({
        id: crop.id,
        name: crop.name,
        createdAt: crop.createdAt,
      });
    });
  }

  async findById(id: string): Promise<Crop | null> {
    const crop = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!crop) {
      return null;
    }

    return Crop.instance({
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt,
    });
  }

  async update(crop: Crop): Promise<Crop> {
    await this.repository.update(crop.id, {
      name: crop.name,
      updatedAt: new Date(),
    });

    return crop;
  }

  async softDelete(id: string): Promise<void> {
    await this.farmCropHarvestRepository.manager.transaction(
      async transaction => {
        await transaction.softDelete(FarmCropHarvestModel, { cropId: id });
        await transaction.softDelete(CropModel, id);
      }
    );
  }
}

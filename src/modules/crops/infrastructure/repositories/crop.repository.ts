import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Crop } from '@/crops/domain/entities/crop.entity';
import { CropModel } from '@/database/models/crop.model';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';

export class CropRepository implements ICropRepository {
  constructor(
    @InjectRepository(CropModel)
    private readonly repository: Repository<CropModel>
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
    });

    return crops.map(crop => {
      return Crop.instance({
        id: crop.id,
        name: crop.name,
        createdAt: crop.createdAt,
      });
    });
  }
}

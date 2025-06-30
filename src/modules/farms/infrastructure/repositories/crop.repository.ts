import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CropModel } from '@/database/models/crop.model';
import { Crop } from '@/farms/domain/entities/crop.entity';
import { ICropRepository } from '@/farms/domain/repositories/crop.repository';

export class CropRepository implements ICropRepository {
  constructor(
    @InjectRepository(CropModel)
    private readonly repository: Repository<CropModel>
  ) {}

  async findById(id: string): Promise<Crop | null> {
    const crop = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!crop) {
      return null;
    }

    return Crop.instance({
      id: crop.id,
      createdAt: crop.createdAt,
    });
  }
}

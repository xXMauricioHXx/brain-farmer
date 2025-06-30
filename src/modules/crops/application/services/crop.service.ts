import { v4 as uuidv4 } from 'uuid';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import {
  CreateCropInput,
  CreateCropOutput,
} from '@/crops/application/dtos/create-crop.dto';
import { CROP_REPOSITORY } from '@/shared/tokens';
import { Crop } from '@/modules/crops/domain/entities/crop.entity';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';
import { ListCropsOutput } from '../dtos/list-crops.dto';

@Injectable()
export class CropService {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly cropRepository: ICropRepository
  ) {}

  async create(input: CreateCropInput): Promise<CreateCropOutput> {
    const crop = Crop.instance({
      id: uuidv4(),
      name: input.name,
    });

    const createdCrop = await this.cropRepository.create(crop);

    return {
      id: createdCrop.id,
      name: createdCrop.name,
      createdAt: createdCrop.createdAt,
    };
  }

  async findAll(): Promise<ListCropsOutput[]> {
    const crops = await this.cropRepository.findAll();

    return crops.map(crop => ({
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt,
    }));
  }
}

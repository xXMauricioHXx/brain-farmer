import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Inject, NotFoundException } from '@nestjs/common';

import {
  CreateCropInput,
  CreateCropOutput,
} from '@/crops/application/dtos/create-crop.dto';
import { CROP_REPOSITORY } from '@/shared/repositories/tokens';
import { ListCropOutput } from '../dtos/list-crop.dto';
import { Crop } from '@/crops/domain/entities/crop.entity';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';
import { logger } from '@/shared/logger/winston.logger';

@Injectable()
export class CropService {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly cropRepository: ICropRepository
  ) {}

  async create(input: CreateCropInput): Promise<CreateCropOutput> {
    logger.info(`Creating crop with name: ${input.name}`);
    const crop = Crop.instance({
      id: uuidv4(),
      name: input.name,
    });

    const createdCrop = await this.cropRepository.create(crop);

    logger.info(`Crop created with ID: ${createdCrop.id}`);
    return {
      id: createdCrop.id,
      name: createdCrop.name,
      createdAt: createdCrop.createdAt,
    };
  }

  async findAll(): Promise<ListCropOutput[]> {
    const crops = await this.cropRepository.findAll();
    logger.info(`Found ${crops.length} crops`);

    return crops.map(crop => ({
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt,
    }));
  }

  async findById(id: string): Promise<ListCropOutput> {
    logger.info(`Finding crop by ID: ${id}`);
    const crop = await this.cropRepository.findById(id);

    if (!crop) {
      logger.error(`Crop with ID ${id} not found`);
      throw new NotFoundException(`Crop not found`);
    }

    return {
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt,
    };
  }

  async update(id: string, input: CreateCropInput): Promise<void> {
    logger.info(`Updating crop with ID: ${id}`);
    const crop = await this.cropRepository.findById(id);

    if (!crop) {
      logger.error(`Crop with ID ${id} not found`);
      throw new NotFoundException(`Crop not found`);
    }

    crop.name = input.name;

    await this.cropRepository.update(crop);
  }

  async delete(id: string): Promise<void> {
    logger.info(`Deleting crop with ID: ${id}`);
    const crop = await this.cropRepository.findById(id);

    if (!crop) {
      logger.error(`Crop with ID ${id} not found`);
      throw new NotFoundException(`Crop not found`);
    }

    await this.cropRepository.softDelete(id);
  }
}

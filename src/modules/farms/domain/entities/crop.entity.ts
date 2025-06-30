import { Decimal } from 'decimal.js';
import {
  IsUUID,
  IsDateString,
  IsInstance,
  IsOptional,
  IsDate,
} from 'class-validator';

import { BaseEntity } from '@/shared/contracts/base-entity';
import { Harvest } from './harvest.entity';

export type CropAttributes = {
  id: string;
  createdAt?: Date;
  plantedArea?: Decimal;
  harvestDate?: Date;
  harvest?: Harvest;
};

export class Crop extends BaseEntity {
  @IsUUID()
  id: string;

  @IsInstance(Decimal)
  @IsOptional()
  plantedArea: Decimal;

  @IsDate()
  @IsOptional()
  harvestDate?: Date;

  @IsInstance(Date)
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  harvest?: Harvest;

  private constructor(input: CropAttributes) {
    super();

    this.id = input.id;
    this.createdAt = input.createdAt;
    this.plantedArea = input.plantedArea ?? new Decimal(0);
    this.harvestDate = input.harvestDate;
    this.harvest = input.harvest;
  }
  public static instance(input: CropAttributes): Crop {
    const crop = new Crop(input);
    crop.validate();
    return crop;
  }

  definePlantedArea(plantedArea: number): void {
    this.plantedArea = new Decimal(plantedArea);
  }

  defineHarvestDate(harvestDate: Date): void {
    this.harvestDate = harvestDate;
  }

  assignHarvest(harvest: Harvest): void {
    this.harvest = harvest;
  }
}

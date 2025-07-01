import { Decimal } from 'decimal.js';
import {
  IsUUID,
  IsString,
  IsNumber,
  IsInstance,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { BaseEntity } from '@/shared/contracts/base-entity';

export type FarmCropHarvestAttributes = {
  name: string;
  cropId: string;
  createdAt?: Date;
  harvestId?: string;
  harvestDate?: string;
  harvestYear?: number;
  plantedArea?: Decimal;
  farmCropHarvestId?: string;
  farmId?: string;
};

export class FarmCropHarvest extends BaseEntity {
  @IsUUID()
  cropId: string;

  @IsString()
  name: string;

  @IsInstance(Decimal)
  @IsOptional()
  plantedArea: Decimal;

  @IsString()
  @IsOptional()
  harvestDate?: string;

  @IsInstance(Date)
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  harvestYear?: number;

  @IsUUID()
  @IsOptional()
  harvestId?: string;

  @IsUUID()
  @IsOptional()
  farmCropHarvestId?: string;

  @IsOptional()
  @IsUUID()
  farmId?: string;

  private constructor(input: FarmCropHarvestAttributes) {
    super();

    this.name = input.name;
    this.cropId = input.cropId;
    this.harvestId = input.harvestId;
    this.createdAt = input.createdAt;
    this.harvestDate = input.harvestDate;
    this.harvestYear = input.harvestYear;
    this.farmId = input.farmId;
    this.farmCropHarvestId = input.farmCropHarvestId;
    this.plantedArea = input.plantedArea ?? new Decimal(0);
  }
  public static instance(input: FarmCropHarvestAttributes): FarmCropHarvest {
    const farmCropHarvest = new FarmCropHarvest(input);
    farmCropHarvest.validate();
    return farmCropHarvest;
  }

  definePlantedArea(plantedArea: number): void {
    this.plantedArea = new Decimal(plantedArea);
  }

  defineHarvestDate(harvestDate: string): void {
    this.harvestDate = harvestDate;
  }

  assignHarvestYear(harvestYear: number): void {
    this.harvestYear = harvestYear;
  }
}

import { Decimal } from 'decimal.js';
import { IsUUID, IsString, IsInstance, IsOptional } from 'class-validator';

import { BaseEntity } from '@/shared/contracts/base-entity';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';
import { InvalidDocumentException } from '@/farms/domain/exceptions/invalid-farm-area.exception';
import { PlantedAreaExceedsLimitException } from '@/farms/domain/exceptions/planted-area-exceeds-limit.exception';

export type FarmAttributes = {
  id: string;
  city: string;
  name: string;
  state: string;
  farmCropHarvests?: FarmCropHarvest[];
  createdAt?: Date;
  totalArea: Decimal;
  vegetationArea: Decimal;
  ruralProducerId: string;
  agricultureArea: Decimal;
};

export class Farm extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  ruralProducerId: string;

  @IsInstance(Decimal)
  totalArea: Decimal;

  @IsInstance(Decimal)
  vegetationArea: Decimal;

  @IsInstance(Decimal)
  agricultureArea: Decimal;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsInstance(Date)
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  farmCropHarvests?: FarmCropHarvest[];

  private constructor(input: FarmAttributes) {
    super();

    this.id = input.id;
    this.name = input.name;
    this.city = input.city;
    this.state = input.state;
    this.totalArea = input.totalArea;
    this.createdAt = input.createdAt;
    this.vegetationArea = input.vegetationArea;
    this.ruralProducerId = input.ruralProducerId;
    this.agricultureArea = input.agricultureArea;
    this.farmCropHarvests = input.farmCropHarvests || [];

    this.validateAreas();
  }

  public static instance(input: FarmAttributes): Farm {
    const farm = new Farm(input);
    farm.validate();
    return farm;
  }

  private validateAreas(): void {
    const total = this.agricultureArea.plus(this.vegetationArea);
    if (total.gt(this.totalArea)) {
      throw new InvalidDocumentException(
        this.totalArea.toString(),
        this.agricultureArea.toString(),
        this.vegetationArea.toString()
      );
    }
  }

  public validatePlantedAreaLimit(crop: FarmCropHarvest): void {
    const currentPlantedArea = this.farmCropHarvests.reduce(
      (acc, crop) => acc.plus(crop.plantedArea),
      new Decimal(0)
    );

    const totalPlantedArea = currentPlantedArea.plus(crop.plantedArea);

    if (totalPlantedArea.gt(this.agricultureArea)) {
      throw new PlantedAreaExceedsLimitException(
        totalPlantedArea.toFixed(),
        this.agricultureArea.toFixed()
      );
    }
  }
}

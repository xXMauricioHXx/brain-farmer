import {
  Min,
  IsUUID,
  IsArray,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CropToFarmInput {
  @IsUUID()
  cropId: string;

  @IsUUID()
  harvestId: string;

  @IsNumber()
  @Min(0)
  plantedArea: number;

  @IsDateString()
  harvestDate: Date;
}

export class AddCropsToFarmInput {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CropToFarmInput)
  crops: CropToFarmInput[];
}

export type AddCropsToFarmOutput = {
  id: string;
  name: string;
  totalArea: string;
  agricultureArea: string;
  vegetationArea: string;
  state: string;
  city: string;
  ruralProducerId: string;
  createdAt: Date;
  crops: {
    id: string;
    plantedArea: string;
    harvestDate: Date;
    createdAt: Date;
  }[];
};

import {
  Min,
  IsUUID,
  IsArray,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListFarmsOutput } from './list-farms.dto';

export class CropToFarmInput {
  @IsUUID()
  cropId: string;

  @IsUUID()
  harvestId: string;

  @IsNumber()
  @Min(0)
  plantedArea: number;

  @IsDateString()
  harvestDate: string;
}

export class AddCropsToFarmInput {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CropToFarmInput)
  crops: CropToFarmInput[];
}

export type AddCropsToFarmOutput = ListFarmsOutput;

import {
  Min,
  IsUUID,
  IsArray,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { ListFarmsOutput } from './list-farms.dto';

export class CropToFarmInput {
  @ApiProperty({
    example: 'ea4cf6eb-be6f-446b-b63c-0f7c06723c71',
    description: 'ID da cultura a ser vinculada',
  })
  @IsUUID()
  cropId: string;

  @ApiProperty({
    example: '409b6495-c874-4f50-bd23-958a3db990e4',
    description: 'ID da safra relacionada à cultura',
  })
  @IsUUID()
  harvestId: string;

  @ApiProperty({
    example: 725.5,
    description: 'Área plantada para essa cultura em hectares',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  plantedArea: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Data prevista para colheita',
    type: String,
    format: 'date',
  })
  @IsDateString()
  harvestDate: string;
}

export class AddCropsToFarmInput {
  @ApiProperty({
    type: [CropToFarmInput],
    description: 'Lista de culturas a serem vinculadas à fazenda',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CropToFarmInput)
  crops: CropToFarmInput[];
}

export type AddCropsToFarmOutput = ListFarmsOutput;

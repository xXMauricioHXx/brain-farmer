import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

import { BaseEntity } from '@/shared/contracts/base-entity';

export type HarvestAttributes = {
  id: string;
  year: number;
  createdAt?: Date;
};

export class Harvest extends BaseEntity {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  year: number;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  private constructor(input: HarvestAttributes) {
    super();

    this.id = input.id;
    this.year = input.year;
    this.createdAt = input.createdAt;
  }

  public static instance(input: HarvestAttributes): Harvest {
    const harvest = new Harvest(input);
    harvest.validate();
    return harvest;
  }
}

import { IsUUID, IsString, IsOptional, IsInstance } from 'class-validator';

import { BaseEntity } from '@/shared/contracts/base-entity';

export type CropAttributes = {
  id: string;
  name: string;
  createdAt?: Date;
};

export class Crop extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsInstance(Date)
  createdAt?: Date;

  private constructor(input: CropAttributes) {
    super();
    this.id = input.id;
    this.name = input.name;
    this.createdAt = input.createdAt;
  }

  public static instance(input: CropAttributes): Crop {
    const crop = new Crop(input);
    crop.validate();
    return crop;
  }
}

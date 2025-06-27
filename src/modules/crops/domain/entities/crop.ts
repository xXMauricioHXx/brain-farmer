import { IsNumber, IsString, IsUUID } from 'class-validator';
import { BaseEntity } from 'src/shared/contracts/base-entity';

export type CropAttributes = {
  id: string;
  name: string;
  harvestYear: number;
  farmId: string;
};

export class Crop extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  harvestYear: number;

  @IsUUID()
  farmId: string;

  private constructor(input: CropAttributes) {
    super();
    this.id = input.id;
    this.name = input.name;
    this.harvestYear = input.harvestYear;
    this.farmId = input.farmId;
  }

  public static instance(input: CropAttributes): Crop {
    const crop = new Crop(input);
    crop.validate();
    return crop;
  }
}

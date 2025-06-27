import { Decimal } from 'decimal.js';
import { BaseEntity } from 'src/shared/contracts/base-entity';
import { IsUUID, IsString, IsInstance } from 'class-validator';

export type FarmAttributes = {
  id: string;
  producerId: string;
  name: string;
  totalArea: number;
  agricultureArea: number;
  vegetationArea: number;
  city: string;
  state: string;
};

export class Farm extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsUUID()
  producerId: string;

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

  private constructor(input: FarmAttributes) {
    super();

    this.id = input.id;
    this.name = input.name;
    this.city = input.city;
    this.state = input.state;
    this.producerId = input.producerId;
    this.totalArea = new Decimal(input.totalArea);
    this.vegetationArea = new Decimal(input.vegetationArea);
    this.agricultureArea = new Decimal(input.agricultureArea);

    this.validateAreas();
  }

  public static instance(input: FarmAttributes): Farm {
    const farm = new Farm(input);
    farm.validate();
    return farm;
  }

  private validateAreas(): void {
    const sum = this.agricultureArea.plus(this.vegetationArea);
    if (sum.gt(this.totalArea)) {
      throw new Error(
        `Invalid areas: agriculture (${this.agricultureArea.toFixed()}) + vegetation (${this.vegetationArea.toFixed()}) exceeds total area (${this.totalArea.toFixed()})`,
      );
    }
  }
}

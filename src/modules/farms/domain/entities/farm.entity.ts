import { Decimal } from 'decimal.js';
import { BaseEntity } from 'src/shared/contracts/base-entity';
import { IsUUID, IsString, IsInstance, IsOptional } from 'class-validator';
import { InvalidDocumentException } from '../exceptions/invalid-farm-area.exception';

export type FarmAttributes = {
  id: string;
  ruralProducerId: string;
  name: string;
  totalArea: number;
  agricultureArea: number;
  vegetationArea: number;
  city: string;
  state: string;
  createdAt?: Date;
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

  private constructor(input: FarmAttributes) {
    super();

    this.id = input.id;
    this.name = input.name;
    this.city = input.city;
    this.state = input.state;
    this.ruralProducerId = input.ruralProducerId;
    this.totalArea = new Decimal(input.totalArea);
    this.vegetationArea = new Decimal(input.vegetationArea);
    this.agricultureArea = new Decimal(input.agricultureArea);
    this.createdAt = input.createdAt;

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
        total.toString(),
        this.agricultureArea.toString(),
        this.vegetationArea.toString()
      );
    }
  }
}

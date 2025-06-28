import { IsUUID, IsString, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateFarmInput {
  @IsUUID()
  ruralProducerId: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @Min(0)
  totalArea: number;

  @IsNumber()
  @Min(0)
  agricultureArea: number;

  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @IsString()
  @MaxLength(255)
  city: string;

  @IsString()
  @MaxLength(2)
  state: string;
}

export type CreateFarmOutput = {
  id: string;
  name: string;
  totalArea: string;
  agricultureArea: string;
  vegetationArea: string;
  state: string;
  city: string;
  ruralProducerId: string;
};

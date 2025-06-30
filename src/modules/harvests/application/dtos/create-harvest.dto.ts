import { IsNumber, IsPositive } from 'class-validator';

export type CreateHarvestOutput = {
  id: string;
  year: number;
  createdAt: Date;
};

export class CreateHarvestInput {
  @IsNumber()
  @IsPositive()
  year: number;
}

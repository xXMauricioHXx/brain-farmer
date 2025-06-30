import { IsString, MaxLength } from 'class-validator';

export class CreateCropInput {
  @IsString()
  @MaxLength(255)
  name: string;
}

export type CreateCropOutput = {
  id: string;
  name: string;
  createdAt: Date;
};

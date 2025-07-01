import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateFarmInput {
  @IsUUID()
  @IsOptional()
  ruralProducerId?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  city: string;

  @IsString()
  @MaxLength(2)
  @IsOptional()
  state: string;
}

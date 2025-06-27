import { IsString } from 'class-validator';

export class CreateRuralProducerDTO {
  @IsString()
  name: string;

  @IsString()
  document: string;
}

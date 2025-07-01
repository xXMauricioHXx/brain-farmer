import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRuralProducerInput {
  @IsString()
  @IsNotEmpty()
  name: string;
}

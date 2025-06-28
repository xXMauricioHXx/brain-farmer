import { IsString, IsNotEmpty, IsUUID, Matches, Length } from 'class-validator';

export class CreateRuralProducerInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  @Matches(/^\d+$/, { message: 'document must contain only digits' })
  document: string;
}

export type CreateRuralProducerOutput = {
  id: string;
  name: string;
  document: string;
  createdAt: Date;
};

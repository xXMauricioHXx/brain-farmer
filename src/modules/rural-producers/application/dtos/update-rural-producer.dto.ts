import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRuralProducerInput {
  @ApiProperty({
    description: 'Novo nome do produtor rural',
    example: 'Carlos Eduardo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

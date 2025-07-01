import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestInput {
  @ApiProperty({
    description: 'Ano da safra',
    example: 2025,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  year: number;
}

export class CreateHarvestOutput {
  @ApiProperty({
    description: 'ID da safra',
    example: 'e3f1c45a-1e0c-4b69-9cfa-9c5f934f04cf',
  })
  id: string;

  @ApiProperty({
    description: 'Ano da safra',
    example: 2025,
  })
  year: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-07-01T12:34:56.789Z',
  })
  createdAt: Date;
}

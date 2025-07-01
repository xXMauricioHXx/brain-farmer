import { ApiProperty } from '@nestjs/swagger';

export class ListHarvestsOutput {
  @ApiProperty({
    description: 'ID da safra',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-07-01T10:00:00.000Z',
  })
  createdAt: Date;
}

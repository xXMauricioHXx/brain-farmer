import { ApiProperty } from '@nestjs/swagger';

export class ListRuralProducerOutput {
  @ApiProperty({
    description: 'ID do produtor rural',
    example: 'd4b5f6e7-1234-4abc-9876-abcdef123456',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'Maria Oliveira',
  })
  name: string;

  @ApiProperty({
    description: 'Documento do produtor (CPF ou CNPJ)',
    example: '98765432100',
  })
  document: string;

  @ApiProperty({
    description: 'Data de criação do produtor',
    example: '2025-07-01T14:30:00.000Z',
  })
  createdAt: Date;
}

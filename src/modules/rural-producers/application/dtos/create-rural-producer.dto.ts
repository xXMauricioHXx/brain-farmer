import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRuralProducerInput {
  @ApiProperty({
    description: 'Nome completo do produtor rural',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CPF ou CNPJ apenas com números (sem pontos ou traços)',
    example: '12345678901',
    minLength: 11,
    maxLength: 14,
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  @Matches(/^\d+$/, { message: 'document must contain only digits' })
  document: string;
}

export class CreateRuralProducerOutput {
  @ApiProperty({
    description: 'ID do produtor rural',
    example: '3f8c0e36-8352-4ad2-90db-9a0b9a63fcf3',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Documento do produtor (CPF ou CNPJ)',
    example: '12345678901',
  })
  document: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-07-01T12:00:00.000Z',
  })
  createdAt: Date;
}

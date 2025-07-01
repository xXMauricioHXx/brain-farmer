import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginatedQueryInput } from '@/shared/repositories/dtos/paginated-query.dto';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CropOutput {
  @ApiProperty({ example: 'Soja', description: 'Nome da cultura agrícola' })
  name: string;

  @ApiProperty({
    example: 'ea4cf6eb-be6f-446b-b63c-0f7c06723c71',
    description: 'ID da cultura (crop)',
  })
  cropId: string;

  @ApiProperty({
    example: '409b6495-c874-4f50-bd23-958a3db990e4',
    description: 'ID da safra (harvest)',
  })
  harvestId: string;

  @ApiProperty({
    example: '2025-07-01T04:16:53.285Z',
    description: 'Data de criação do vínculo',
  })
  createdAt: Date;

  @ApiProperty({ example: 2026, description: 'Ano da safra' })
  harvestYear: number;

  @ApiProperty({ example: '725.5', description: 'Área plantada em hectares' })
  plantedArea: string;

  @ApiProperty({ example: '2026-01-01', description: 'Data da colheita' })
  harvestDate: string;

  @ApiProperty({
    example: '24df6e88-68bb-49b6-8693-ca85fa84f118',
    description: 'ID do relacionamento entre fazenda, cultura e safra',
  })
  farmCropHarvestId: string;
}

export class ListFarmsOutput {
  @ApiProperty({
    example: 'cb02b9de-73fe-4962-ae12-6598b4337190',
    description: 'ID da fazenda',
  })
  id: string;

  @ApiProperty({ example: 'Fazenda A', description: 'Nome da fazenda' })
  name: string;

  @ApiProperty({
    example: '1200',
    description: 'Área total da fazenda em hectares',
  })
  totalArea: string;

  @ApiProperty({ example: '1000', description: 'Área destinada à agricultura' })
  agricultureArea: string;

  @ApiProperty({ example: '200', description: 'Área de vegetação nativa' })
  vegetationArea: string;

  @ApiProperty({ example: 'RS', description: 'Estado (UF) da fazenda' })
  state: string;

  @ApiProperty({ example: 'Viamão', description: 'Cidade da fazenda' })
  city: string;

  @ApiProperty({
    example: 'ea77396e-d568-4b70-a6ca-af163debdad5',
    description: 'ID do produtor rural associado',
  })
  ruralProducerId: string;

  @ApiProperty({
    example: '2025-07-01T04:14:03.518Z',
    description: 'Data de criação do registro',
  })
  createdAt: Date;

  @ApiProperty({
    type: [CropOutput],
    description: 'Lista de culturas associadas à fazenda',
  })
  @Type(() => CropOutput)
  crops: CropOutput[];
}

export class ListFarmsInput extends PaginatedQueryInput {
  @ApiPropertyOptional({ example: 'RS' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;
}

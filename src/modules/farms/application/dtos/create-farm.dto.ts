import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateFarmInput {
  @ApiProperty({ format: 'uuid', description: 'ID do produtor rural' })
  @IsUUID()
  ruralProducerId: string;

  @ApiProperty({ maxLength: 255, description: 'Nome da fazenda' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ minimum: 0, description: 'Área total da fazenda em hectares' })
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty({
    minimum: 0,
    description: 'Área agrícola da fazenda em hectares',
  })
  @IsNumber()
  @Min(0)
  agricultureArea: number;

  @ApiProperty({
    minimum: 0,
    description: 'Área de vegetação da fazenda em hectares',
  })
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({ maxLength: 255, description: 'Cidade da fazenda' })
  @IsString()
  @MaxLength(255)
  city: string;

  @ApiProperty({ maxLength: 2, description: 'UF (estado) da fazenda' })
  @IsString()
  @MaxLength(2)
  state: string;
}

export class CreateFarmOutput {
  @ApiProperty({
    example: 'b5f97597-cf54-43ab-a60e-2cfa7e4b4538',
    description: 'ID da fazenda',
  })
  id: string;

  @ApiProperty({
    example: 'Fazenda A',
    description: 'Nome da fazenda',
  })
  name: string;

  @ApiProperty({
    example: '1200',
    description: 'Área total da fazenda (em hectares), em string',
  })
  totalArea: string;

  @ApiProperty({
    example: '1000',
    description: 'Área agrícola da fazenda (em hectares), em string',
  })
  agricultureArea: string;

  @ApiProperty({
    example: '200',
    description: 'Área de vegetação da fazenda (em hectares), em string',
  })
  vegetationArea: string;

  @ApiProperty({
    example: 'RS',
    description: 'Estado da fazenda (UF)',
  })
  state: string;

  @ApiProperty({
    example: 'Viamão',
    description: 'Cidade da fazenda',
  })
  city: string;

  @ApiProperty({
    example: 'ea77396e-d568-4b70-a6ca-af163debdad5',
    description: 'ID do produtor rural responsável pela fazenda',
  })
  ruralProducerId: string;

  @ApiProperty({
    example: '2025-07-01T04:30:58.281Z',
    description: 'Data de criação da fazenda',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}

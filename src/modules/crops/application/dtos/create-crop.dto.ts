import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCropInput {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Soja',
    description: 'Nome da cultura agrícola',
    maxLength: 255,
  })
  name: string;
}

export class CreateCropOutput {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  id: string;

  @ApiProperty({ example: 'Soja' })
  name: string;

  @ApiProperty({ example: '2025-06-30T12:00:00.000Z' })
  createdAt: Date;
}

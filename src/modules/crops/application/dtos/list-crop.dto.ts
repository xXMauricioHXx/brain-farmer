import { ApiProperty } from '@nestjs/swagger';

export class ListCropOutput {
  @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-1234-56789abcdef0' })
  id: string;

  @ApiProperty({ example: 'Milho' })
  name: string;

  @ApiProperty({ example: '2025-06-30T12:00:00.000Z' })
  createdAt: Date;
}

import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginatedQueryInput {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export class PaginatedQueryOutput<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

import { PaginatedQueryInput } from './dtos/paginated-query.dto';

export const paginatedOptions = (input: PaginatedQueryInput) => {
  return {
    skip: (input.page - 1) * input.limit,
    take: input.limit,
  };
};

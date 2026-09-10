export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function parsePaginationParams(params?: PaginationParams) {
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params?.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  keyword?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export function getPaginationParams(pageQuery?: any, limitQuery?: any, defaultLimit = 10) {
  const page = Math.max(1, parseInt(pageQuery, 10) || 1);
  const limit = Math.max(1, parseInt(limitQuery, 10) || defaultLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

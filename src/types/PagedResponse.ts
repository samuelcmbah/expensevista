export interface PagedResponse<T> {
  data: T[];
  page: number;
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
}
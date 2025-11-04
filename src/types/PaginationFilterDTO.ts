import type { TransactionFilterDTO } from "./transaction/TransactionFilterDTO";

export interface PaginationFilterDTO {
  page: number;
  recordsPerPage: number;
  filters?: TransactionFilterDTO
}
import type { CategoryDTO } from "./CategoryDTO";
import type { TransactionType } from "./TransactionType";

export interface TransactionDTO {
  id: number;
  amount: number;
  description?: string | null;
  type: TransactionType;
  transactionDate: string;
  category: CategoryDTO;
}
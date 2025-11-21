import type { CategoryDTO } from "../Category/CategoryDTO";
import type { TransactionType } from "./TransactionType";
export interface TransactionDTO {
  id: number;
  amount: string;
  description?: string | null;
  type: TransactionType;
  transactionDate: string;
  category: CategoryDTO;
  currency: string;
  convertedAmount: string;
}
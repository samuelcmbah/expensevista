import type { TransactionType } from "./TransactionType";

export interface EditTransactionDTO {
  id: number;
  amount: number;
  type: TransactionType; // 0 = Expense, 1 = Income
  transactionDate: string;
  categoryId: number;
  description?: string;
}

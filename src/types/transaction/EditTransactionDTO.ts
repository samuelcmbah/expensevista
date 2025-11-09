import type { TransactionType } from "./TransactionType";

export interface EditTransactionDTO {
  id: number;
  amount: string;
  type: TransactionType | ""; // 0 = Expense, 1 = Income
  transactionDate: string;
  categoryId: number | "";
  description?: string;
}

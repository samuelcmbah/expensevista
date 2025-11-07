import type { TransactionType } from "./TransactionType";

export default interface CreateTransactionDTO {
  amount: string;
  type: TransactionType;
  transactionDate: string; // ISO string
  categoryId: number;
  description?: string;
}
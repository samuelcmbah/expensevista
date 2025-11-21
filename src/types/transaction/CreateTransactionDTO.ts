import type { TransactionType } from "./TransactionType";

export default interface CreateTransactionDTO {
  amount: string;
  type: TransactionType| null | undefined;
  transactionDate: string; // ISO string
  categoryId: number | null | undefined;
  description?: string;
  currency?: string; // default NGN

}
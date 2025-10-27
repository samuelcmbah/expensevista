import type { TransactionDTO } from "../types/TransactionDTO";
import apiClient from "./apiClient";

export const getRecentTransactions = async (): Promise<TransactionDTO[]> => {
  const response = await apiClient.get<TransactionDTO[]>("/transactions");
  console.log("✅ Fetched recent transactions:", response.data);
  return response.data;
};
import type { EditTransactionDTO } from "../types/EditTransactionDTO";
import type { TransactionDTO } from "../types/TransactionDTO";
import apiClient from "./apiClient";

export const getAllTransactions = async (): Promise<TransactionDTO[]> => {
  const response = await apiClient.get<TransactionDTO[]>("/transactions");
  console.log("✅ Fetched recent transactions:", response.data);
  return response.data;
};

export const getTransactionById = async (id: number) => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data;
};

export const updateTransaction = async (id: number, data: EditTransactionDTO) => {
  const response = await apiClient.put(`/transactions/${id}`, data);
  return response.data;
};


export const deleteTransaction = async (id: number): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`);
  console.log(`✅ Deleted transaction with id: ${id}`);
};
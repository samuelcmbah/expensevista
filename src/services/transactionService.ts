import type { PagedResponse } from "../types/PagedResponse";
import type { PaginationFilterDTO } from "../types/PaginationFilterDTO";
import type CreateTransactionDTO from "../types/transaction/CreateTransactionDTO";
import type { EditTransactionDTO } from "../types/transaction/EditTransactionDTO";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import { privateApiClient } from "./apiClient";



export async function getFilteredPagedTransactions({page, recordsPerPage, filters}: PaginationFilterDTO): Promise<PagedResponse<TransactionDTO>> {
  const params = new URLSearchParams({
    page: page.toString(),
    recordsPerPage: recordsPerPage.toString(),
  });

  if (filters) {
    if (filters.searchTerm?.trim()) params.append("searchTerm", filters.searchTerm);
    if (filters.categoryName?.trim()) params.append("categoryName", filters.categoryName);
    if (filters.type !== undefined) params.append("type", filters.type.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
  }

  const response = await privateApiClient.get<PagedResponse<TransactionDTO>>("/transactions/filter", { params });
  return response.data;
};


export const createTransaction = async (data: CreateTransactionDTO): Promise<TransactionDTO> => {
  const response = await privateApiClient.post("/transactions", data);
  return response.data;
};


export const getTransactionById = async (id: number): Promise<TransactionDTO> => {
  const response = await privateApiClient.get(`/transactions/${id}`);
  return response.data;
};

export const updateTransaction = async (id: number, data: EditTransactionDTO): Promise<TransactionDTO> => {
  const payload = { ...data, amount: parseFloat(data.amount) };
  const response = await privateApiClient.put(`/transactions/${id}`, payload);
  return response.data;
};


export const deleteTransaction = async (id: number): Promise<void> => {
  await privateApiClient.delete(`/transactions/${id}`);
};
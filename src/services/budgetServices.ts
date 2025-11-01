import apiClient from "./apiClient";
import type { BudgetDTO } from "../types/Budget/BudgetDTO";
import type { EditBudgetDTO } from "../types/Budget/EditBudgetDTO";
import type { CreateBudgetDTO } from "../types/Budget/CreateBudgetDTO";

export const getBudgetStatus = async (): Promise<BudgetDTO> => {
  const now = new Date();
  
  //FIX: Use Date.UTC() to create the date in UTC, preventing any local timezone shift.
  const firstDayOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  
  // Now, firstDayOfMonth will be 2025-10-01T00:00:00.000Z internally.
  const formattedMonth = firstDayOfMonth.toISOString().split("T")[0]; // "2025-10-01"

  const response = await apiClient.get<BudgetDTO>("/budgets/status", {
    params: { month: formattedMonth },
  });

  return response.data;
};

export const updateMonthlyBudget = async (id: number, data: EditBudgetDTO): Promise<BudgetDTO> => {
  const response = await apiClient.put<BudgetDTO>(`/budgets/${id}`, data );
  return response.data;
}

export const createMonthlyBudget = async (data: CreateBudgetDTO): Promise<BudgetDTO> => {
  const response = await apiClient.post<BudgetDTO>("/budgets", data);
  return response.data;
}


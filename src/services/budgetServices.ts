import { privateApiClient } from "./apiClient";
import type { BudgetDTO } from "../types/Budget/BudgetDTO";
import type { EditBudgetDTO } from "../types/Budget/EditBudgetDTO";
import type { CreateBudgetDTO } from "../types/Budget/CreateBudgetDTO";



export const updateMonthlyBudget = async (id: number, data: EditBudgetDTO): Promise<BudgetDTO> => {
  const response = await privateApiClient.put<BudgetDTO>(`/budgets/${id}`, data );
  return response.data;
}

export const createMonthlyBudget = async (data: CreateBudgetDTO): Promise<BudgetDTO> => {
  const response = await privateApiClient.post<BudgetDTO>("/budgets", data);
  return response.data;
}


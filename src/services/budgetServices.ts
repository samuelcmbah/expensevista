import apiClient from "./apiClient";
import type { BudgetDTO } from "../types/Budget/BudgetDTO";
import type { EditBudgetDTO } from "../types/Budget/EditBudgetDTO";
import type { CreateBudgetDTO } from "../types/Budget/CreateBudgetDTO";



export const updateMonthlyBudget = async (id: number, data: EditBudgetDTO): Promise<BudgetDTO> => {
  const response = await apiClient.put<BudgetDTO>(`/budgets/${id}`, data );
  console.log("Updated Budget Response:", response.data);
  return response.data;
}

export const createMonthlyBudget = async (data: CreateBudgetDTO): Promise<BudgetDTO> => {
  const response = await apiClient.post<BudgetDTO>("/budgets", data);
console.log("Created Budget Response:", response.data);
  return response.data;
}


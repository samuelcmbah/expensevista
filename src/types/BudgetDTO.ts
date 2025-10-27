export interface BudgetDTO {
  id: number;
  monthlyLimit: number;
  budgetMonth: string;
  currentUsage: number;
  remainingAmount: number;
  percentageUsed: number;
  totalIncome?: number;
}
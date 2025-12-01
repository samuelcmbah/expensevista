export interface BudgetDTO {
  id: number;
  monthlyLimit: string;
  budgetMonth: string;
  currentUsage: string;
  remainingAmount: string;
  overSpent: string;
  percentageUsed: string;
  totalIncome?: string;
}
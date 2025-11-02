export interface SpendingCategory {
  name: string;
  value: number;
  percentage: number;
  [key: string]: string | number; // ✅ Allow Recharts to read dynamic keys
}

export interface BudgetProgress {
  spent: number;
  total: number;
  percentage: number;
}

export interface IncomeExpenseData {
  month: string;
  income: number;
  expenses: number;
}

export interface KeyInsights {
  topSpendingCategory: string;
  topSpendingAmount: number;
  totalTransactions: number;
  totalIncomeTransactions: number;
  totalExpenseTransactions: number;
}

export interface FinancialData {
  timePeriod: "This Month" | "Last 3 Months" | "Last 6 Months" | "This Year";
  budgetProgress: BudgetProgress;
  spendingByCategory: SpendingCategory[];
  incomeVsExpenses: IncomeExpenseData[];
  financialTrend: IncomeExpenseData[];
  keyInsights: KeyInsights;
}

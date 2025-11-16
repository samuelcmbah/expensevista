export interface SpendingCategory {
  name: string;
  value: string;
  percentage: string;
  [key: string]: string | string; // ✅ Allow Recharts to read dynamic keys
}

export interface BudgetProgress {
  spent: string;
  total: string;
  percentage: string;
}

export interface Summary{
  totalIncome: string;
  totalExpenses: string;
  netBalance: string;
  savingsRate: string;
}

export interface IncomeExpenseData {
  month: string;
  income: string;
  expenses: string;
}

export interface KeyInsights {
  topSpendingCategory: string;
  topSpendingAmount: string;
  totalTransactions: string;
  totalIncomeTransactions: string;
  totalExpenseTransactions: string;
}

export interface FinancialData {
  timePeriod: "This Month" | "Last Month" | "Last 3 Months" | "Last 6 Months" | "This Year";
  summary: Summary;
  budgetProgress: BudgetProgress;
  spendingByCategory: SpendingCategory[];
  incomeVsExpenses: IncomeExpenseData[];
  financialTrend: IncomeExpenseData[];
  keyInsights: KeyInsights;
}

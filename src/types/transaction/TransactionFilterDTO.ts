export interface TransactionFilterDTO {
  description?: string;
  categoryId?: number;
  type?: number; // matches backend enum (0 = Expense, 1 = Income)
  startDate?: string; 
  endDate?: string;   
}

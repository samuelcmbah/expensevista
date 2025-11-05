export interface TransactionFilterDTO {
  searchTerm?: string; //description/category
  categoryName?: string;
  type?: number; // matches backend enum (0 = Expense, 1 = Income)
  startDate?: string; 
  endDate?: string;   
}

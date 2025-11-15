import type { BudgetDTO } from "./Budget/BudgetDTO";
import type {PeriodicSummaryDTO} from "./PeriodicSummaryDTO"

export interface DashboardDTO{
  summary : PeriodicSummaryDTO,
  budget : BudgetDTO
}
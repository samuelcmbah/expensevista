import type { FinancialData } from "../types/analytics";
import apiClient from "./apiClient";

export const getAnalyticsReport = async (timePeriod: string): Promise<FinancialData> => {
  const response = await apiClient.get<FinancialData>("/analytics", {
    params: { period: timePeriod },
  });
  return response.data;
}


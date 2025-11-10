import type { FinancialData } from "../types/analytics";
import apiClient from "./apiClient";

export const getAnalyticsReport = async (timePeriod: string): Promise<FinancialData> => {
  const response = await apiClient.get<FinancialData>("/analytics", {
    params: { period: timePeriod },
  });
  console.log("Fetched Analytics Data:", response.data);
  return response.data;
}


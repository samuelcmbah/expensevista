import type { FinancialData } from "../types/analytics";
import { privateApiClient } from "./apiClient";

export const getAnalyticsReport = async (timePeriod: string): Promise<FinancialData> => {
  const response = await privateApiClient.get<FinancialData>("/analytics", {
    params: { period: timePeriod },
  });
  return response.data;
}


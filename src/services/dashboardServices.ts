import type { DashboardDTO } from "../types/dashboardDTO";
import { privateApiClient } from "./apiClient";

export const getDashboardData = async (): Promise<DashboardDTO> => {

  const response = await privateApiClient.get<DashboardDTO>("/dashboard");
  return response.data;
};
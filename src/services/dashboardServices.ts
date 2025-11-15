import type { DashboardDTO } from "../types/dashboardDTO";
import apiClient from "./apiClient";

export const getDashboardData = async (): Promise<DashboardDTO> => {

  const response = await apiClient.get<DashboardDTO>("/dashboard");
  console.log(response.data)
  return response.data;
};
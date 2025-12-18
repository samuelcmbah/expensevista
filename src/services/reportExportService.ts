import { privateApiClient } from "./apiClient";

export const exportAnalyticsReport = async (period: string) => {
  const response = await privateApiClient.post(
    "/report-export/export",
    { period },
    {
      responseType: "blob", // critical for file download
    }
  );

  return response.data;
};
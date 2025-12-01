import type { AxiosError } from "axios";

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorCode?: string;
  traceId?: string;
  timestamp?: string;
}

export default function extractErrors(error: AxiosError): string[] {
  // No response → network error, timeout, CORS failure, offline, etc.
  if (!error.response) {
    return ["Network error: Please check your internet connection."];
  }

  const data = error.response.data as ErrorResponse | string | undefined;

  if (!data) {
    return ["An unexpected error occurred. Please try again later."];
  }

  // CASE 1: Backend returned simple string error, rare but p
  if (typeof data === "string") {
    return [data];
  }

  // Case 2 — Proper ErrorResponse
  if (data.message) {
    return [data.message];
  }

  // Fallback
  return ["An unexpected error occurred."];
}

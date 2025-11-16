import type { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  errors?: any;
}

export default function extractErrors(error: AxiosError): string[] {
  // No response → network error, timeout, CORS failure, offline, etc.
  if (!error.response) {
    return ["Network error: Please check your internet connection."];
  }

  const data = error.response.data as ErrorResponse | string | undefined;
  let messages: string[] = [];

  if (!data) {
    return ["An unexpected error occurred. Please try again later."];
  }

  // CASE 1: Backend returned simple string error
  // e.g., return BadRequest("Category already exists")
  if (typeof data === "string") {
    return [data];
  }

  // CASE 2: Backend returned { message: "...", errors: ... }
  // Handle field-level validation errors
  if (data.errors) {
    const err = data.errors;

    // When errors is an array
    if (Array.isArray(err)) {
      messages.push(...err);
    }

    // When errors is an object { field: [msg1, msg2] }
    else if (typeof err === "object") {
      for (const field in err) {
        const fieldErrors = err[field];
        if (Array.isArray(fieldErrors)) {
          messages.push(...fieldErrors.map(msg => `${field}: ${msg}`));
        }
      }
    }
  }

  // CASE 3: Global "message" key
  if (typeof data.message === "string") {
    messages.unshift(data.message);
  }

  // Final fallback
  if (messages.length === 0) {
    messages.push("An unexpected error occurred.");
  }

  return messages;
}

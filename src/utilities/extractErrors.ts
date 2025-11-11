import type { AxiosError } from "axios";

// Defines the expected backend error structure
interface ErrorResponse {
  message?: string;
  errors?: {
    [field: string]: string[];
  };
}

export default function extractErrors(obj: AxiosError): string[] {
  const data = obj.response?.data as ErrorResponse | undefined;
  let messages: string[] = [];

  if (!data) {
    return ["An unexpected network error occurred. Please try again later."];
  }

  // Handle field-level errors
  if (data.errors) {
    if (Array.isArray(data.errors)) {
      // Case 1: errors is a simple array
      messages = [...messages, ...data.errors];
    } else if (typeof data.errors === "object") {
      // Case 2: errors is an object with field names
      for (const field in data.errors) {
        const fieldErrors = data.errors[field];
        if (Array.isArray(fieldErrors)) {
          const formatted = fieldErrors.map(msg => `${field}: ${msg}`);
          messages = [...messages, ...formatted];
        }
      }
    }
  }

  // Handle global or general message (e.g. "Email already exists")
  if (data.message && !messages.includes(data.message)) {
    messages.unshift(data.message);
  }

  // Fallback in case everything else fails
  if (messages.length === 0) {
    messages.push("An unexpected error occurred.");
  }

  return messages;
}



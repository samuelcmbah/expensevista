import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import extractErrors from "./extractErrors";

export function handleAxiosError(error: unknown, toastId: string) {
  const messages = extractErrors(error as AxiosError);
  const uniqueMessages = [...new Set(messages)];
  uniqueMessages.forEach((msg) => toast.error(msg, { id: toastId }));
}
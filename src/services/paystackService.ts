import apiClient from "./apiClient";

export const initializeTopUp = async (email: string, amount: number) => {
  const response = await apiClient.post("/paystack/initialize", { email, amount });
  return response.data.authoriazationUrl as string ;
}

export const verifyPayment = async (reference: string) => {
  const response = await apiClient.get(`/paystack/verify/${reference}`);
  return response.data;
}
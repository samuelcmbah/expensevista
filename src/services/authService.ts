import type { LoginDTO } from "../types/auth/LoginDTO";
import type { RegisterDTO } from "../types/auth/RegisterDTO";
import apiClient from "./apiClient";



export const registerUser = async (data: RegisterDTO) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};


export const loginUser = async (data: LoginDTO) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};


export async function confirmEmail(email: string, token: string) {
  return apiClient.post("/auth/confirm-email", { email, token });
}

export async function resendEmailVerification(email: string) {
  return apiClient.post("/auth/resend-verification", { email });
}

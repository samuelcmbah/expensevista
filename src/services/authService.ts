import type { LoginDTO } from "../types/auth/LoginDTO";
import type { RegisterDTO } from "../types/auth/RegisterDTO";
import type { ResetPasswordDTO } from "../types/auth/ResetPasswordDTO";
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
  const response = apiClient.post("/auth/resend-verification", { email });
  console.log("Resend email response:", response);
  return response;
}

export async function forgotPassword(email: string) {
// returns 200 even if no account exists
return apiClient.post("/auth/forgot-password", { email });
}


export async function resetPassword(dto: ResetPasswordDTO) {
return apiClient.post("/auth/reset-password", dto);
}

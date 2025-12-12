import type { LoginDTO } from "../types/auth/LoginDTO";
import type { RegisterDTO } from "../types/auth/RegisterDTO";
import type { ResetPasswordDTO } from "../types/auth/ResetPasswordDTO";
import {publicApiClient} from "./apiClient";



export const registerUser = async (data: RegisterDTO) => {
  const response = await publicApiClient.post("/auth/register", data);
  return response.data;
};


export const loginUser = async (data: LoginDTO) => {
  const response = await publicApiClient.post("/auth/login", data);
  return response.data;
};


export async function confirmEmail(email: string, token: string) {
  return publicApiClient.post("/auth/confirm-email", { email, token });
}

export async function resendEmailVerification(email: string) {
  const response = publicApiClient.post("/auth/resend-verification", { email });
  return response;
}

export async function forgotPassword(email: string) {
// returns 200 even if no account exists
return publicApiClient.post("/auth/forgot-password", { email });
}


export async function resetPassword(dto: ResetPasswordDTO) {
return publicApiClient.post("/auth/reset-password", dto);
}

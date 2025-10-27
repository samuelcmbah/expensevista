import type { LoginDTO } from "../types/LoginDTO";
import type { RegisterDTO } from "../types/RegisterDTO";
import apiClient from "./apiClient";



export const registerUser = async (data: RegisterDTO) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};


export const loginUser = async (data: LoginDTO) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

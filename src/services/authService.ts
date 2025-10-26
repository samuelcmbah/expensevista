import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://localhost:7000"; // adjust if needed
const AUTH_URL = `${API_BASE.replace(/\/+$/, "")}/api/auth`;

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${AUTH_URL}/register`, data);
  return response.data;
};

export type LoginData = {
  email: string;
  password: string;
} 

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${AUTH_URL}/login`, data);
  return response.data;
};
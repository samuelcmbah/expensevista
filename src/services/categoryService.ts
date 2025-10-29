import apiClient from "./apiClient";
import type { CategoryDTO } from "../types/CategoryDTO";

export const getAllCategories = async (): Promise<CategoryDTO[]> => {
  const response = await apiClient.get<CategoryDTO[]>("/categories");
  console.log("✅ Fetched categories:", response.data);
  return response.data;
}
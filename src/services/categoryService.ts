import apiClient from "./apiClient";
import type { CategoryDTO } from "../types/Category/CategoryDTO";
import type { CreateCategoryDTO } from "../types/Category/CreateCategoryDTO";

export const getAllCategories = async (): Promise<CategoryDTO[]> => {
  const response = await apiClient.get<CategoryDTO[]>("/categories");
  return response.data;
};

export const createCategory = async (data: CreateCategoryDTO): Promise<CategoryDTO> => {
  const response = await apiClient.post("/categories", data);
  return response.data;
}

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
}

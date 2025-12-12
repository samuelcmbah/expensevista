import { privateApiClient } from "./apiClient";
import type { CategoryDTO } from "../types/Category/CategoryDTO";
import type { CreateCategoryDTO } from "../types/Category/CreateCategoryDTO";

export const getAllCategories = async (): Promise<CategoryDTO[]> => {
  const response = await privateApiClient.get<CategoryDTO[]>("/categories");
  return response.data;
};

export const createCategory = async (data: CreateCategoryDTO): Promise<CategoryDTO> => {
  const response = await privateApiClient.post("/categories", data);
  return response.data;
}

export const deleteCategory = async (id: number): Promise<void> => {
  await privateApiClient.delete(`/categories/${id}`);
}

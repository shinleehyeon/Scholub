import { apiClient } from "./client";

export interface Category {
  category: string;
  count: number;
}

export interface CategoriesResponse {
  status: number;
  method: string;
  instance: string;
  details: string;
  data: Category[];
  errors: Record<string, unknown> | null;
  timestamp: string;
}

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const response =
      await apiClient.get<CategoriesResponse>("/papers/categories");
    return response.data;
  },
};

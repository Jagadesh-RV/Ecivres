import client from './client';
import { Category } from '../../types';

export const categoryService = {
  /**
   * Fetch all categories
   */
  getAllCategories: async (): Promise<Category[]> => {
    const response = await client.get('/categories');
    return response.data;
  },

  /**
   * Fetch a single category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await client.get(`/categories/${id}`);
    return response.data;
  },
};

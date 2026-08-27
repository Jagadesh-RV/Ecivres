import client from './client';
import { Service } from '../../types';

export interface ServiceQueryParams {
  categoryId?: string;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const serviceService = {
  /**
   * Fetch all services with optional query filtering
   */
  getAllServices: async (params?: ServiceQueryParams): Promise<Service[]> => {
    const response = await client.get('/services', { params });
    return response.data;
  },

  /**
   * Fetch a single service by ID
   */
  getServiceById: async (id: string): Promise<Service> => {
    const response = await client.get(`/services/${id}`);
    return response.data;
  },
};

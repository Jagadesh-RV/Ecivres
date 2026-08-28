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

  /**
   * Create a new service (Provider only)
   */
  createService: async (data: any) => {
    const response = await client.post('/services', data);
    return response.data;
  },

  /**
   * Update an existing service (Provider only)
   */
  updateService: async (id: string, data: any) => {
    const response = await client.patch(`/services/${id}`, data);
    return response.data;
  },

  /**
   * Delete a service (Provider only)
   */
  deleteService: async (id: string) => {
    const response = await client.delete(`/services/${id}`);
    return response.data;
  },
};

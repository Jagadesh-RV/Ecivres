import { client } from "../axios";

export interface UserRole {
  role: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ProviderProfile {
  id: string;
  businessName: string;
  description?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  userRoles: UserRole[];
  customerProfile: CustomerProfile | null;
  providerProfile: ProviderProfile | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    services: number;
  };
}

export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await client.get("/admin/users");
    return response.data;
  },

  verifyProvider: async (providerProfileId: string): Promise<any> => {
    const response = await client.patch(`/admin/providers/${providerProfileId}/verify`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await client.get("/categories");
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await client.post("/categories", data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<any> => {
    const response = await client.delete(`/categories/${id}`);
    return response.data;
  },
};

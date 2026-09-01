import client from './client';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateCustomerProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export const userService = {
  getCurrentUser: async () => {
    const response = await client.get('/users/me');
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await client.post('/users/change-password', payload);
    return response.data;
  },

  updateCustomerProfile: async (payload: UpdateCustomerProfilePayload) => {
    const response = await client.patch('/users/profiles/customer', payload);
    return response.data;
  },
};

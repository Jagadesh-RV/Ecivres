import client from './client';

export const bookingService = {
  createBooking: async (data: { serviceId: string; scheduledAt: string }) => {
    const response = await client.post('/bookings', data);
    return response.data;
  },

  getCustomerBookings: async () => {
    const response = await client.get('/bookings/customer');
    return response.data;
  },

  getProviderBookings: async () => {
    const response = await client.get('/bookings/provider');
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await client.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string) => {
    const response = await client.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }
};

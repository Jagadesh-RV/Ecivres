import client from './client';

export const createBooking = async (data: { serviceId: string; scheduledAt: string }) => {
  const response = await client.post('/bookings', data);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await client.get('/bookings');
  return response.data;
};

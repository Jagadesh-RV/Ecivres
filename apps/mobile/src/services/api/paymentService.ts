import client from './client';

export const paymentService = {
  getPayment: async (bookingId: string) => {
    const response = await client.get(`/payments/${bookingId}`);
    return response.data;
  },

  payForBooking: async (bookingId: string, transactionId?: string) => {
    const response = await client.post(`/payments/${bookingId}/pay`, { transactionId });
    return response.data;
  }
};

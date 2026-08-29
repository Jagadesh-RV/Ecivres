import { client } from "../axios";

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentsApi = {
  getPayment: async (bookingId: string): Promise<Payment> => {
    const response = await client.get(`/payments/${bookingId}`);
    return response.data;
  },

  payForBooking: async (bookingId: string, transactionId?: string): Promise<Payment> => {
    const response = await client.post(`/payments/${bookingId}/pay`, { transactionId });
    return response.data;
  },
};

import { client } from "../axios";

export interface CreateBookingPayload {
  serviceId: string;
  scheduledAt: string;
}

export const bookingsApi = {
  createBooking: async (data: CreateBookingPayload) => {
    const response = await client.post("/bookings", data);
    return response.data;
  },

  getCustomerBookings: async () => {
    const response = await client.get("/bookings");
    return response.data;
  },

  getProviderBookings: async () => {
    const response = await client.get("/bookings/provider");
    return response.data;
  },

  updateBookingStatus: async (id: string, status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    const response = await client.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

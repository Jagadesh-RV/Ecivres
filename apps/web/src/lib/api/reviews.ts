import { client } from "../axios";

export const reviewsApi = {
  createReview: async (data: { serviceId: string; bookingId: string; rating: number; comment?: string }) => {
    const response = await client.post("/reviews", data);
    return response.data;
  },

  getServiceReviews: async (serviceId: string) => {
    const response = await client.get(`/reviews/service/${serviceId}`);
    return response.data;
  },

  getProviderStats: async (providerId: string) => {
    const response = await client.get(`/reviews/provider/${providerId}/stats`);
    return response.data;
  },
};

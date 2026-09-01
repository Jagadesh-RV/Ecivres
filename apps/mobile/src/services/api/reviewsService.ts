import client from './client';

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewsService = {
  createReview: async (payload: CreateReviewPayload) => {
    const response = await client.post('/reviews', payload);
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

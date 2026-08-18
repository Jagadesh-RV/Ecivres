import client from './client';

export const getServices = async (categoryId?: string) => {
  const url = categoryId ? `/services?categoryId=${categoryId}` : '/services';
  const response = await client.get(url);
  return response.data;
};

export const getServiceDetails = async (id: string) => {
  const response = await client.get(`/services/${id}`);
  return response.data;
};

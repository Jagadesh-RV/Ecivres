export type CustomerStackParamList = {
  CustomerDashboard: undefined;
  CategoryList: undefined;
  ServiceList: { categoryId?: string };
  ServiceDetails: { serviceId: string };
  ProviderDetails: { providerId: string };
};

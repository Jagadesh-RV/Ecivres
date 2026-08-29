export type CustomerStackParamList = {
  CustomerDashboard: undefined;
  CategoryList: undefined;
  ServiceList: { categoryId?: string };
  ServiceDetails: { serviceId: string };
  ProviderDetails: { providerId: string };
  CustomerBookings: undefined;
  Notifications: undefined;
};

export type ProviderStackParamList = {
  ProviderDashboard: undefined;
  ProviderProfileSetup: undefined;
  ProviderBookings: undefined;
  ProviderServices: undefined;
  ProviderServiceForm: { serviceId?: string };
  Notifications: undefined;
};

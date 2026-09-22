export const DeepLinkingConfig = {
  prefixes: ['https://ecivres.com', 'ecivres://'],
  config: {
    screens: {
      CustomerDashboard: 'customer',
      BookingDetails: 'bookings/:id',
      ProviderProfile: 'provider/:id',
    },
  },
};

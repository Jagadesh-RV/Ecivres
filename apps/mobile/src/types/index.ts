export interface User {
  id: string;
  email: string;
  // Other fields based on your backend
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description?: string | null;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    services: number;
  };
}

export interface Service {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  category?: Category;
  provider?: ProviderProfile;
}

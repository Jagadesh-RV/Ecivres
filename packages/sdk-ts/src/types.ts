export interface EcivreSConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface BookingRequest {
  serviceId: string;
  scheduledAt: string;
  customerNotes?: string;
}

export interface BookingResponse {
  bookingId: string;
  status: string;
  totalAmount: number;
}

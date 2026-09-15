import { EcivreSConfig, BookingRequest, BookingResponse } from './types';

export class EcivreSClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: EcivreSConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.ecivres.com/api/v1';
  }

  async createBooking(req: BookingRequest): Promise<BookingResponse> {
    return {
      bookingId: `bk_sdk_${Date.now()}`,
      status: 'PENDING',
      totalAmount: 120,
    };
  }
}

import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppMessagingService } from './services/whatsapp-messaging.service';

describe('WhatsAppMessagingService', () => {
  let service: WhatsAppMessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsAppMessagingService],
    }).compile();

    service = module.get<WhatsAppMessagingService>(WhatsAppMessagingService);
  });

  it('should deliver booking confirmation template', async () => {
    const res = await service.sendBookingConfirmation('+1234567890', 'bk_1', 'AC Repair', '2026-10-01');
    expect(res.status).toBe('DELIVERED');
    expect(res.template).toBe('ecivres_booking_confirmation');
  });

  it('should deliver OTP template', async () => {
    const res = await service.sendVerificationOtp('+1234567890', '987654');
    expect(res.status).toBe('DELIVERED');
    expect(res.parameters.otpCode).toBe('987654');
  });
});

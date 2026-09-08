import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailConfigService } from './email.config';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'RESEND_API_KEY') return 're_test_key';
              if (key === 'EMAIL_FROM') return 'test@ecivres.com';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send welcome email via Resend', async () => {
    const res = await service.sendWelcomeEmail('user@test.com', 'Alex');
    expect(res.status).toEqual('SENT');
    expect(res.to).toEqual('user@test.com');
  });

  it('should send booking confirmation email', async () => {
    const res = await service.sendBookingConfirmationEmail('user@test.com', {
      bookingId: 'b-100',
      serviceName: 'Plumbing',
      scheduledAt: '2026-10-10T10:00:00Z',
      price: 150,
    });
    expect(res.status).toEqual('SENT');
    expect(res.subject).toContain('b-100');
  });
});

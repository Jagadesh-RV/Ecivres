import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('sk_test_mock_key'),
          },
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create mock payment intent when secret key is mock', async () => {
    const intent = await service.createPaymentIntent(150, 'usd', { bookingId: 'b-1' });
    expect(intent.id).toContain('pi_mock_');
    expect(intent.amount).toBe(150);
    expect(intent.currency).toBe('usd');
  });
});

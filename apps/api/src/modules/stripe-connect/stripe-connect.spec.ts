import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { StripeConnectService } from './services/stripe-connect.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StripeConnectService', () => {
  let service: StripeConnectService;

  const mockPrisma = {
    stripeConnectAccount: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeConnectService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StripeConnectService>(StripeConnectService);
  });

  it('should generate Stripe Connect Express onboarding link', async () => {
    mockPrisma.stripeConnectAccount.findUnique.mockResolvedValue(null);
    mockPrisma.stripeConnectAccount.create.mockResolvedValue({
      providerId: 'prov_1',
      stripeAccountId: 'acct_express_123',
    });
    mockPrisma.stripeConnectAccount.update.mockResolvedValue({});

    const res = await service.generateOnboardingLink('prov_1');
    expect(res.stripeAccountId).toBe('acct_express_123');
    expect(res.onboardingUrl).toContain('express/onboarding/acct_express_123');
  });
});

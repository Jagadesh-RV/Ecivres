import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ViralReferralService } from './services/viral-referral.service';
import { QrGeneratorService } from './services/qr-generator.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ViralReferralService', () => {
  let service: ViralReferralService;

  const mockPrisma = {
    referralTreeRecord: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViralReferralService,
        QrGeneratorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ViralReferralService>(ViralReferralService);
  });

  it('should track a valid viral invite', async () => {
    mockPrisma.referralTreeRecord.findUnique.mockResolvedValue(null);
    mockPrisma.referralTreeRecord.create.mockResolvedValue({
      id: 'ref_1',
      referrerId: 'u_1',
      refereeId: 'u_2',
      referralCode: 'REF123',
      status: 'PENDING',
    });

    const res = await service.trackInvite('u_1', 'u_2', 'REF123');
    expect(res.referrerId).toBe('u_1');
    expect(res.status).toBe('PENDING');
  });

  it('should reward referrer when referee completes qualifying booking', async () => {
    mockPrisma.referralTreeRecord.findUnique.mockResolvedValue({
      id: 'ref_1',
      referrerId: 'u_1',
      refereeId: 'u_2',
      status: 'PENDING',
      rewardAmountUsd: 15.0,
    });
    mockPrisma.referralTreeRecord.update.mockResolvedValue({
      id: 'ref_1',
      status: 'REWARDED',
    });

    const res = await service.qualifyAndRewardReferral('u_2', 50.0);
    expect(res?.status).toBe('REWARDED');
  });

  it('should detect fraud when referrer and referee share same IP or device', async () => {
    const res = await service.evaluateReferralFraudRisk('192.168.1.10', '192.168.1.10', 'dev_1', 'dev_1');
    expect(res.isFraud).toBe(true);
    expect(res.riskReason).toBe('SAME_IP_ADDRESS');
  });
});

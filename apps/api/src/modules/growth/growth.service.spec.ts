import { Test, TestingModule } from '@nestjs/testing';
import { GrowthService } from './growth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GrowthService', () => {
  let service: GrowthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrowthService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<GrowthService>(GrowthService);
  });

  it('should generate referral QR code and deep link', async () => {
    const res = await service.generateReferralQr('u100');
    expect(res.referralCode).toContain('ECV-');
    expect(res.deepLink).toContain('/invite?code=');
    expect(res.qrCodeUrl).toContain('api.qrserver.com');
  });

  it('should process contact invitation batch', async () => {
    const res = await service.inviteContacts({
      inviterUserId: 'u100',
      contacts: [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', phone: '+15550192831' },
      ],
      channel: 'WHATSAPP',
    });
    expect(res.sentCount).toBe(2);
    expect(res.channel).toBe('WHATSAPP');

    const count = await service.getInvitesSentCount('u100');
    expect(count).toBe(2);
  });
});

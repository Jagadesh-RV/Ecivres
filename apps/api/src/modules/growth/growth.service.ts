import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ReferralQrCode {
  referralCode: string;
  qrCodeUrl: string;
  deepLink: string;
  shareMessage: string;
}

export interface ContactInviteRequest {
  inviterUserId: string;
  contacts: { name: string; email?: string; phone?: string }[];
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
}

@Injectable()
export class GrowthService {
  private referralStore: Map<string, string> = new Map(); // referralCode -> referrerUserId
  private invitesSentStore: Map<string, number> = new Map(); // referrerUserId -> count

  constructor(private readonly prisma: PrismaService) {}

  async generateReferralQr(userId: string): Promise<ReferralQrCode> {
    const referralCode = `ECV-${userId.substring(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.referralStore.set(referralCode, userId);

    const deepLink = `https://ecivres.com/invite?code=${referralCode}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(deepLink)}`;
    const shareMessage = `Join me on EcivreS! Use my referral code ${referralCode} to get $25 off your first home service booking: ${deepLink}`;

    return {
      referralCode,
      qrCodeUrl,
      deepLink,
      shareMessage,
    };
  }

  async inviteContacts(dto: ContactInviteRequest): Promise<{ sentCount: number; channel: string }> {
    if (!dto.contacts || dto.contacts.length === 0) {
      throw new BadRequestException('At least one contact is required');
    }

    const current = this.invitesSentStore.get(dto.inviterUserId) || 0;
    this.invitesSentStore.set(dto.inviterUserId, current + dto.contacts.length);

    return {
      sentCount: dto.contacts.length,
      channel: dto.channel,
    };
  }

  async getInvitesSentCount(userId: string): Promise<number> {
    return this.invitesSentStore.get(userId) || 0;
  }
}

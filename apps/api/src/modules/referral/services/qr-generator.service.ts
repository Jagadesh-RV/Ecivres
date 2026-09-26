import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QrGeneratorService {
  private readonly logger = new Logger(QrGeneratorService.name);

  generateReferralQrCode(referrerId: string, referralCode: string): string {
    const encodedPayload = Buffer.from(JSON.stringify({ referrerId, referralCode, app: 'ecivres' })).toString('base64');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://ecivres.com/invite?ref=${referralCode}&payload=${encodedPayload}`)}`;
    this.logger.log(`Generated QR referral code URL for user ${referrerId} (${referralCode})`);
    return qrUrl;
  }
}

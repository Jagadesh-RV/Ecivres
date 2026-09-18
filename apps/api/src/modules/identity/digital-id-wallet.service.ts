import { Injectable, Logger } from '@nestjs/common';
import { RegisterDigitalIdDto } from './dto/register-digital-id.dto';

export interface DigitalWalletRecord {
  walletId: string;
  userId: string;
  identityType: string;
  didIdentifier: string;
  verifiedCredentialsCount: number;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}

@Injectable()
export class DigitalIdWalletService {
  private readonly logger = new Logger(DigitalIdWalletService.name);

  async registerWallet(dto: RegisterDigitalIdDto): Promise<DigitalWalletRecord> {
    const walletId = `wlt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.logger.log(`Registering Digital ID wallet ${walletId} with DID ${dto.didIdentifier}`);

    return {
      walletId,
      userId: dto.userId,
      identityType: dto.identityType,
      didIdentifier: dto.didIdentifier,
      verifiedCredentialsCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { VerifyLicenseDto } from './dto/verify-license.dto';

export interface LicenseVerificationResult {
  verificationId: string;
  providerId: string;
  licenseNumber: string;
  issuingStateAuthority: string;
  isValid: boolean;
  verificationStatus: 'ACTIVE_VALIDATED' | 'EXPIRED' | 'UNVERIFIED';
  verifiedAt: string;
}

@Injectable()
export class LicenseVerifierService {
  private readonly logger = new Logger(LicenseVerifierService.name);

  async verifyLicense(dto: VerifyLicenseDto): Promise<LicenseVerificationResult> {
    const verificationId = `lic_vrf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const expDate = new Date(dto.expirationDate).getTime();
    const isExpired = expDate < Date.now();

    this.logger.log(`Verifying trade license ${dto.licenseNumber} issued by ${dto.issuingStateAuthority}`);

    return {
      verificationId,
      providerId: dto.providerId,
      licenseNumber: dto.licenseNumber,
      issuingStateAuthority: dto.issuingStateAuthority,
      isValid: !isExpired,
      verificationStatus: isExpired ? 'EXPIRED' : 'ACTIVE_VALIDATED',
      verifiedAt: new Date().toISOString(),
    };
  }
}

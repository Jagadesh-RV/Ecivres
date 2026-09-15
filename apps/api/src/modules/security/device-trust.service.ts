import { Injectable, Logger } from '@nestjs/common';

export interface DeviceTrustScore {
  fingerprintHash: string;
  isRecognizedDevice: boolean;
  trustScore: number; // 0-100
  requiresMfaStepUp: boolean;
}

@Injectable()
export class DeviceTrustService {
  private readonly logger = new Logger(DeviceTrustService.name);

  evaluateDeviceTrust(fingerprint: string, userAgent: string, ip: string, knownFingerprints: string[]): DeviceTrustScore {
    const isRecognizedDevice = knownFingerprints.includes(fingerprint);
    const trustScore = isRecognizedDevice ? 95 : 40;
    const requiresMfaStepUp = trustScore < 70;

    this.logger.log(`Evaluated device trust for ${ip}: Trust Score ${trustScore}, StepUp: ${requiresMfaStepUp}`);

    return {
      fingerprintHash: fingerprint,
      isRecognizedDevice,
      trustScore,
      requiresMfaStepUp,
    };
  }
}

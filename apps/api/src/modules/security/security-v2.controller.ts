import { Controller, Post, Body } from '@nestjs/common';
import { PasskeyService } from './passkey.service';
import { DeviceTrustService } from './device-trust.service';

@Controller('security/v2')
export class SecurityV2Controller {
  constructor(
    private readonly passkeyService: PasskeyService,
    private readonly deviceTrust: DeviceTrustService,
  ) {}

  @Post('passkey/register-options')
  getPasskeyOptions(@Body() body: { userId: string; email: string }) {
    return this.passkeyService.generateRegistrationOptions(body.userId, body.email);
  }

  @Post('device-trust/evaluate')
  evaluateDevice(@Body() body: { fingerprint: string; userAgent: string; ip: string; knownFingerprints?: string[] }) {
    return this.deviceTrust.evaluateDeviceTrust(body.fingerprint, body.userAgent, body.ip, body.knownFingerprints || []);
  }
}

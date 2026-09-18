import { Controller, Post, Body } from '@nestjs/common';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { LicenseVerifierService } from './license-verifier.service';
import { BackgroundCheckService } from './background-check.service';

@Controller('government')
export class GovernmentController {
  constructor(
    private readonly licenseVerifier: LicenseVerifierService,
    private readonly backgroundCheck: BackgroundCheckService,
  ) {}

  @Post('verify-license')
  verifyLicense(@Body() dto: VerifyLicenseDto) {
    return this.licenseVerifier.verifyLicense(dto);
  }

  @Post('background-check')
  performCheck(@Body() body: { providerId: string; ssnLast4: string }) {
    return this.backgroundCheck.performBackgroundCheck(body.providerId, body.ssnLast4);
  }
}

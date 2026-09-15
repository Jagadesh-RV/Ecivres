import { Module } from '@nestjs/common';
import { PasskeyService } from './passkey.service';
import { DeviceTrustService } from './device-trust.service';
import { SecurityV2Controller } from './security-v2.controller';

@Module({
  controllers: [SecurityV2Controller],
  providers: [PasskeyService, DeviceTrustService],
  exports: [PasskeyService, DeviceTrustService],
})
export class SecurityV2Module {}

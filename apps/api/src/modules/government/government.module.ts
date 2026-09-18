import { Module } from '@nestjs/common';
import { LicenseVerifierService } from './license-verifier.service';
import { BackgroundCheckService } from './background-check.service';
import { GovernmentController } from './government.controller';

@Module({
  controllers: [GovernmentController],
  providers: [LicenseVerifierService, BackgroundCheckService],
  exports: [LicenseVerifierService, BackgroundCheckService],
})
export class GovernmentModule {}

import { Module } from '@nestjs/common';
import { RegionalKycRulesService } from './services/regional-kyc-rules.service';
import { VerificationGlobalController } from './verification-global.controller';

@Module({
  controllers: [VerificationGlobalController],
  providers: [RegionalKycRulesService],
  exports: [RegionalKycRulesService],
})
export class VerificationGlobalModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QrGeneratorService } from './services/qr-generator.service';
import { ViralReferralService } from './services/viral-referral.service';
import { ViralReferralController } from './viral-referral.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ViralReferralController],
  providers: [QrGeneratorService, ViralReferralService],
  exports: [ViralReferralService],
})
export class ViralReferralModule {}

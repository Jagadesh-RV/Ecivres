import { Module } from '@nestjs/common';
import { TrustScoreService } from './services/trust-score.service';
import { ReputationController } from './reputation.controller';

@Module({
  controllers: [ReputationController],
  providers: [TrustScoreService],
  exports: [TrustScoreService],
})
export class ReputationModule {}

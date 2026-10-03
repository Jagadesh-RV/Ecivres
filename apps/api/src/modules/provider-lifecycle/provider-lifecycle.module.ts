import { Module } from '@nestjs/common';
import { ProviderActivationService } from './services/provider-activation.service';
import { ProviderRetentionService } from './services/provider-retention.service';
import { ProviderHealthScoreService } from './services/provider-health-score.service';
import { ProviderLifecycleController } from './provider-lifecycle.controller';

@Module({
  controllers: [ProviderLifecycleController],
  providers: [ProviderActivationService, ProviderRetentionService, ProviderHealthScoreService],
  exports: [ProviderActivationService, ProviderRetentionService, ProviderHealthScoreService],
})
export class ProviderLifecycleModule {}

import { Module } from '@nestjs/common';
import { ApiKeyManagerService } from './api-key-manager.service';
import { WebhookEngineService } from './webhook-engine.service';
import { DeveloperPortalController } from './developer-portal.controller';

@Module({
  controllers: [DeveloperPortalController],
  providers: [ApiKeyManagerService, WebhookEngineService],
  exports: [ApiKeyManagerService, WebhookEngineService],
})
export class DeveloperModule {}

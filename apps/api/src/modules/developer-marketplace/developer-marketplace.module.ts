import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebhookDispatcherService } from './services/webhook-dispatcher.service';
import { DeveloperMarketplaceController } from './developer-marketplace.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DeveloperMarketplaceController],
  providers: [WebhookDispatcherService],
  exports: [WebhookDispatcherService],
})
export class DeveloperMarketplaceModule {}

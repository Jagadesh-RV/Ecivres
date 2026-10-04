import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MarketplaceHealthService } from './services/marketplace-health.service';
import { MarketplaceAlertService } from './services/marketplace-alert.service';
import { MarketplaceCommandCenterService } from './services/marketplace-command-center.service';
import { CommandCenterController } from './command-center.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CommandCenterController],
  providers: [MarketplaceHealthService, MarketplaceAlertService, MarketplaceCommandCenterService],
  exports: [MarketplaceHealthService, MarketplaceAlertService, MarketplaceCommandCenterService],
})
export class CommandCenterModule {}

import { Module } from '@nestjs/common';
import { ExpansionAnalyticsService } from './services/expansion-analytics.service';
import { ExpansionConsoleController } from './expansion-console.controller';

@Module({
  controllers: [ExpansionConsoleController],
  providers: [ExpansionAnalyticsService],
  exports: [ExpansionAnalyticsService],
})
export class ExpansionConsoleModule {}

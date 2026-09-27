import { Module } from '@nestjs/common';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';
import { RevenueIntelligenceController } from './revenue-intelligence.controller';

@Module({
  controllers: [RevenueIntelligenceController],
  providers: [RevenueIntelligenceService],
  exports: [RevenueIntelligenceService],
})
export class RevenueIntelligenceModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OfflineIntelligenceService } from './services/offline-intelligence.service';
import { EdgeAiController } from './edge-ai.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EdgeAiController],
  providers: [OfflineIntelligenceService],
  exports: [OfflineIntelligenceService],
})
export class EdgeAiModule {}

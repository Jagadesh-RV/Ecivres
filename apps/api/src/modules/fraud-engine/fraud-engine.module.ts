import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FraudIntelligenceService } from './services/fraud-intelligence.service';
import { FraudEngineController } from './fraud-engine.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FraudEngineController],
  providers: [FraudIntelligenceService],
  exports: [FraudIntelligenceService],
})
export class FraudEngineModule {}

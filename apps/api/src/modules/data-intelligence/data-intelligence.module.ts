import { Module } from '@nestjs/common';
import { ChurnPredictorService } from './churn-predictor.service';
import { DataIntelligenceController } from './data-intelligence.controller';

@Module({
  controllers: [DataIntelligenceController],
  providers: [ChurnPredictorService],
  exports: [ChurnPredictorService],
})
export class DataIntelligenceModule {}

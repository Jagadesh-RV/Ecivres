import { Controller, Post, Body } from '@nestjs/common';
import { ChurnPredictorService } from './churn-predictor.service';
import { ChurnAnalysisDto } from './dto/churn-analysis.dto';

@Controller('data-intelligence')
export class DataIntelligenceController {
  constructor(private readonly churnPredictor: ChurnPredictorService) {}

  @Post('churn-predict')
  analyzeChurnRisk(@Body() dto: ChurnAnalysisDto) {
    return this.churnPredictor.analyzeChurnRisk(dto);
  }
}

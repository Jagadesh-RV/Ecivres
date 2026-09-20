import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CohortAnalyzerService } from './services/cohort-analyzer.service';
import { EnterpriseBiController } from './enterprise-bi.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EnterpriseBiController],
  providers: [CohortAnalyzerService],
  exports: [CohortAnalyzerService],
})
export class EnterpriseBiModule {}

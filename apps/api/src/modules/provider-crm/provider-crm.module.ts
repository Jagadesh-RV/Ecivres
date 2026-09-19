import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LeadScoringService } from './services/lead-scoring.service';
import { ProviderCrmController } from './provider-crm.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderCrmController],
  providers: [LeadScoringService],
  exports: [LeadScoringService],
})
export class ProviderCrmModule {}

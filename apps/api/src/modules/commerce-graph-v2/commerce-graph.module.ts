import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { GraphRecommendationService } from './services/graph-recommendation.service';
import { CommerceGraphController } from './commerce-graph.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CommerceGraphController],
  providers: [GraphRecommendationService],
  exports: [GraphRecommendationService],
})
export class CommerceGraphModule {}

import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { SearchParserService } from './search-parser.service';
import { RecommendationController } from './recommendation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, SearchParserService],
  exports: [RecommendationService, SearchParserService],
})
export class AiModule {}

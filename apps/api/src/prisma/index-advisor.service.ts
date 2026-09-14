import { Injectable, Logger } from '@nestjs/common';

export interface RecommendedIndex {
  table: string;
  columns: string[];
  reason: string;
}

@Injectable()
export class IndexAdvisorService {
  private readonly logger = new Logger(IndexAdvisorService.name);

  getRecommendedIndexes(): RecommendedIndex[] {
    return [
      { table: 'Booking', columns: ['userId', 'status'], reason: 'High frequency customer booking history query' },
      { table: 'Booking', columns: ['providerId', 'scheduledAt'], reason: 'Provider calendar slot lookup optimization' },
      { table: 'Service', columns: ['categoryId', 'isActive'], reason: 'Marketplace service discovery filtering' },
      { table: 'Review', columns: ['providerId', 'rating'], reason: 'Provider rating aggregate computation' },
    ];
  }
}

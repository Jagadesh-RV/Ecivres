import { Injectable, Logger } from '@nestjs/common';

export interface MaintenanceItem {
  id: string;
  title: string;
  category: string;
  recommendedSeason: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  dueMonth: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
}

@Injectable()
export class MaintenanceTimelineService {
  private readonly logger = new Logger(MaintenanceTimelineService.name);

  getCustomerTimeline(customerId: string): MaintenanceItem[] {
    this.logger.log(`Fetching annual home maintenance timeline for customer ${customerId}`);

    return [
      {
        id: 'maint_1',
        title: 'HVAC Air Filter Replacement & Tune-up',
        category: 'HVAC',
        recommendedSeason: 'AUTUMN',
        dueMonth: 'October',
        status: 'PENDING',
      },
      {
        id: 'maint_2',
        title: 'Gutter Cleaning & Roof Inspection',
        category: 'Roofing',
        recommendedSeason: 'AUTUMN',
        dueMonth: 'November',
        status: 'PENDING',
      },
      {
        id: 'maint_3',
        title: 'Pest Prevention Barrier Treatment',
        category: 'Pest Control',
        recommendedSeason: 'SPRING',
        dueMonth: 'April',
        status: 'COMPLETED',
      },
    ];
  }
}

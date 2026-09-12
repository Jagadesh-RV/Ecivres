import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface HeatmapRegion {
  zipCode: string;
  regionName: string;
  latitude: number;
  longitude: number;
  demandIntensity: number; // 0 to 100
  topCategoryNeeded: string;
}

export interface ConversionFunnelMetrics {
  totalVisitors: number;
  searchPerformed: number;
  providerProfileViews: number;
  checkoutStarted: number;
  bookingCompleted: number;
  overallConversionRate: number; // percentage
}

export interface ProviderHealthMetrics {
  totalActiveProviders: number;
  averageMonthlyEarnings: number;
  averageResponseTimeMinutes: number;
  providerRetentionRateMonth3: number; // percentage
}

@Injectable()
export class MarketplaceIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDemandHeatmap(): Promise<HeatmapRegion[]> {
    return [
      {
        zipCode: '10001',
        regionName: 'Manhattan Central',
        latitude: 40.7501,
        longitude: -73.9996,
        demandIntensity: 92,
        topCategoryNeeded: 'Emergency Plumbing',
      },
      {
        zipCode: '11201',
        regionName: 'Brooklyn Heights',
        latitude: 40.6958,
        longitude: -73.9936,
        demandIntensity: 78,
        topCategoryNeeded: 'House Deep Cleaning',
      },
      {
        zipCode: '90210',
        regionName: 'Beverly Hills',
        latitude: 34.0736,
        longitude: -118.4004,
        demandIntensity: 85,
        topCategoryNeeded: 'Smart Home Installation',
      },
    ];
  }

  async getConversionFunnel(): Promise<ConversionFunnelMetrics> {
    const totalVisitors = 10000;
    const searchPerformed = 7800;
    const providerProfileViews = 5200;
    const checkoutStarted = 2400;
    const bookingCompleted = 1850;

    const overallConversionRate = Number(((bookingCompleted / totalVisitors) * 100).toFixed(2));

    return {
      totalVisitors,
      searchPerformed,
      providerProfileViews,
      checkoutStarted,
      bookingCompleted,
      overallConversionRate,
    };
  }

  async getProviderHealthIndex(): Promise<ProviderHealthMetrics> {
    return {
      totalActiveProviders: 420,
      averageMonthlyEarnings: 4250,
      averageResponseTimeMinutes: 14,
      providerRetentionRateMonth3: 88.5,
    };
  }
}

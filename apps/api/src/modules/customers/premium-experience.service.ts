import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ArServicePreview {
  serviceId: string;
  arModelUrl: string;
  previewType: 'ROOM_CLEANING' | 'FURNITURE_ASSEMBLY' | 'LANDSCAPING' | 'PAINTING';
  supportedDevices: string[];
}

export interface MaintenanceReminder {
  id: string;
  category: string;
  recommendedService: string;
  dueDate: Date;
  reasoning: string;
  estimatedCost: number;
}

export interface SubscriptionBundle {
  id: string;
  name: string;
  servicesIncluded: string[];
  frequency: 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL';
  discountPercentage: number;
  monthlyPrice: number;
}

@Injectable()
export class PremiumCustomerExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async getArPreviewModel(serviceId: string): Promise<ArServicePreview> {
    return {
      serviceId,
      arModelUrl: `https://models.ecivres.com/ar/${serviceId}.usdz`,
      previewType: 'FURNITURE_ASSEMBLY',
      supportedDevices: ['iOS_ARKit', 'Android_ARCore'],
    };
  }

  async getAiMaintenanceReminders(userId: string): Promise<MaintenanceReminder[]> {
    const nextMonth = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    return [
      {
        id: 'rem_hvac',
        category: 'Climate & HVAC',
        recommendedService: 'Seasonal AC Filter Replacement & Coil Sanitization',
        dueDate: nextMonth,
        reasoning: 'Last serviced 6 months ago. Summer high-temperature surge expected.',
        estimatedCost: 110,
      },
      {
        id: 'rem_roof',
        category: 'Roof & Gutters',
        recommendedService: 'Autumn Gutter Clearing & Downspout Flush',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
        reasoning: 'Prevent heavy rain blockage before winter season.',
        estimatedCost: 145,
      },
    ];
  }

  async getSubscriptionBundles(): Promise<SubscriptionBundle[]> {
    return [
      {
        id: 'sub_carefree_home',
        name: 'Carefree Home Bundle',
        servicesIncluded: ['Monthly Deep House Cleaning', 'Quarterly HVAC Check', 'Annual Plumbing Flush'],
        frequency: 'MONTHLY',
        discountPercentage: 20,
        monthlyPrice: 199,
      },
      {
        id: 'sub_lawn_master',
        name: 'Lawn & Garden Carefree Package',
        servicesIncluded: ['Bi-weekly Mowing', 'Seasonal Fertilizer Spread', 'Irrigation Check'],
        frequency: 'MONTHLY',
        discountPercentage: 15,
        monthlyPrice: 149,
      },
    ];
  }
}

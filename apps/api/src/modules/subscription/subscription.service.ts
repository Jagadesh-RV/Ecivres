import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: 'FREE' | 'PRO_PROVIDER' | 'ENTERPRISE_PROVIDER';
  monthlyPrice: number;
  commissionRate: number;
  features: string[];
}

@Injectable()
export class SubscriptionService {
  private readonly plans: SubscriptionPlan[] = [
    {
      id: 'plan_free',
      name: 'Free Basic Tier',
      code: 'FREE',
      monthlyPrice: 0,
      commissionRate: 0.10, // 10% marketplace fee
      features: ['Standard Listing', 'Basic Analytics', 'Standard Support'],
    },
    {
      id: 'plan_pro',
      name: 'Pro Provider',
      code: 'PRO_PROVIDER',
      monthlyPrice: 29.99,
      commissionRate: 0.05, // 5% marketplace fee
      features: [
        'AI Recommendation Priority Boost',
        'Reduced 5% Commission Fee',
        'Verified Premium Badge',
        'Calendar Sync Integration',
      ],
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise Provider',
      code: 'ENTERPRISE_PROVIDER',
      monthlyPrice: 99.99,
      commissionRate: 0.02, // 2% marketplace fee
      features: [
        'Top Search Placement',
        'Reduced 2% Commission Fee',
        'Dedicated Account Manager',
        'Custom Lead Automation',
      ],
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.plans;
  }
}

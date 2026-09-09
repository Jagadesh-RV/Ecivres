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

export interface ProviderSubscriptionState {
  providerId: string;
  planCode: 'FREE' | 'PRO_PROVIDER' | 'ENTERPRISE_PROVIDER';
  isPremium: boolean;
  commissionRate: number;
  expiresAt?: Date;
}

@Injectable()
export class SubscriptionService {
  private readonly plans: SubscriptionPlan[] = [
    {
      id: 'plan_free',
      name: 'Free Basic Tier',
      code: 'FREE',
      monthlyPrice: 0,
      commissionRate: 0.10,
      features: ['Standard Listing', 'Basic Analytics', 'Standard Support'],
    },
    {
      id: 'plan_pro',
      name: 'Pro Provider',
      code: 'PRO_PROVIDER',
      monthlyPrice: 29.99,
      commissionRate: 0.05,
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
      commissionRate: 0.02,
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

  async upgradeProviderSubscription(
    providerId: string,
    planCode: 'PRO_PROVIDER' | 'ENTERPRISE_PROVIDER',
  ): Promise<ProviderSubscriptionState> {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const selectedPlan = this.plans.find((p) => p.code === planCode);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return {
      providerId,
      planCode,
      isPremium: true,
      commissionRate: selectedPlan ? selectedPlan.commissionRate : 0.05,
      expiresAt,
    };
  }
}

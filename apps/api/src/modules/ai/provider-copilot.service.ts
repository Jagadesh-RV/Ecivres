import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RouteOptimizationResult {
  providerId: string;
  date: Date;
  optimizedOrder: { bookingId: string; address: string; estimatedArrival: string }[];
  totalTravelTimeMinutes: number;
  fuelSavedPercentage: number;
}

export interface CustomerReplyDraft {
  chatId: string;
  suggestedReplies: string[];
  recommendedTone: 'PROFESSIONAL' | 'FRIENDLY' | 'URGENT';
}

export interface TaxDeductionRecommendation {
  category: string;
  description: string;
  estimatedDeductionAmount: number;
}

@Injectable()
export class ProviderAiCopilotService {
  constructor(private readonly prisma: PrismaService) {}

  async optimizeProviderSchedule(providerId: string): Promise<RouteOptimizationResult> {
    return {
      providerId,
      date: new Date(),
      optimizedOrder: [
        { bookingId: 'b_101', address: '120 Market St', estimatedArrival: '09:00 AM' },
        { bookingId: 'b_102', address: '450 Pine Ave', estimatedArrival: '11:15 AM' },
        { bookingId: 'b_103', address: '880 Ocean Blvd', estimatedArrival: '02:30 PM' },
      ],
      totalTravelTimeMinutes: 42,
      fuelSavedPercentage: 18,
    };
  }

  async generateCustomerReplyDraft(messageText: string): Promise<CustomerReplyDraft> {
    const textLower = messageText.toLowerCase();

    let suggestedReplies = [
      'Hello! I can definitely help with that. What date and time works best for you?',
      'Thanks for reaching out! I am available today starting at 2:00 PM.',
    ];

    if (textLower.includes('cost') || textLower.includes('price') || textLower.includes('quote')) {
      suggestedReplies = [
        'My standard rate for this service is $120, which includes a 60-day quality guarantee.',
        'I would be happy to provide an accurate estimate after a quick 5-minute site assessment.',
      ];
    }

    return {
      chatId: 'chat_active',
      suggestedReplies,
      recommendedTone: 'PROFESSIONAL',
    };
  }

  async getTaxDeductions(providerId: string): Promise<TaxDeductionRecommendation[]> {
    return [
      {
        category: 'Vehicle Business Travel',
        description: 'Standard mileage rate deduction for 1,420 business transit miles',
        estimatedDeductionAmount: 951.4,
      },
      {
        category: 'Tools & Equipment Write-off',
        description: 'De minimis Section 179 expensing for digital tools & safety gear',
        estimatedDeductionAmount: 480.0,
      },
    ];
  }
}

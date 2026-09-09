import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendedProviders(customerId?: string, latitude?: number, longitude?: number, limit = 10) {
    // Recommendation service skeleton
    const providers = await this.prisma.providerProfile.findMany({
      include: {
        services: true,
        user: {
          include: {
            reviews: true,
            bookings: true,
          },
        },
      },
      take: limit,
    });

    return providers.map((provider) => ({
      providerId: provider.id,
      businessName: provider.businessName,
      isVerified: provider.isVerified,
      servicesCount: provider.services.length,
      score: 1.0,
    }));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        customerProfile: true,
        providerProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async verifyProvider(providerProfileId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: { isVerified: true },
    });
  }
}

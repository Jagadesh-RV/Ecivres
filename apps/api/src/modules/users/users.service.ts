import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: { include: { role: true } },
        customerProfile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;

    // Map roles for easier access on frontend
    const mappedResult = {
      ...result,
      roles: result.userRoles.filter(ur => ur.role).map((ur) => ur.role!.name),
      hasCustomerProfile: !!result.customerProfile,
      hasProviderProfile: !!result.providerProfile,
    };

    return mappedResult;
  }
}

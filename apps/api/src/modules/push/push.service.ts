import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { PushConfigService } from './push.config';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private userDeviceTokens = new Map<string, Set<{ token: string; platform: string }>>();

  constructor(
    private prisma: PrismaService,
    private pushConfigService: PushConfigService,
  ) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    if (!this.userDeviceTokens.has(userId)) {
      this.userDeviceTokens.set(userId, new Set());
    }

    const userTokens = this.userDeviceTokens.get(userId)!;
    userTokens.add({ token: dto.token, platform: dto.platform });

    this.logger.log(`Registered FCM device token for user ${userId} on ${dto.platform}`);

    return {
      success: true,
      userId,
      registeredTokensCount: userTokens.size,
    };
  }

  async unregisterDevice(userId: string, token: string) {
    const userTokens = this.userDeviceTokens.get(userId);
    if (userTokens) {
      for (const item of userTokens) {
        if (item.token === token) {
          userTokens.delete(item);
          break;
        }
      }
    }
    return { success: true };
  }

  async getUserDeviceTokens(userId: string) {
    const tokens = this.userDeviceTokens.get(userId);
    return Array.from(tokens || []);
  }
}

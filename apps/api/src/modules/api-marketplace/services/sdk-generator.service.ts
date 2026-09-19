import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SdkGeneratorService {
  private readonly logger = new Logger(SdkGeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerApp(developerId: string, name: string, ratePlan: string) {
    const appId = `app_${Date.now()}`;
    const apiKey = `ecv_live_${Math.random().toString(36).substring(2, 15)}`;
    this.logger.log(`Registering public API marketplace application ${appId} (${name}) with key ${apiKey}`);
    return this.prisma.apiMarketplaceApp.create({
      data: {
        appId,
        developerId,
        name,
        apiKey,
        ratePlan,
        monthlyRequests: 0,
      },
    });
  }

  async generateSdkClient(appId: string) {
    this.logger.log(`Generating TypeScript SDK bundle for developer application ${appId}`);
    return {
      appId,
      sdkVersion: 'v7.0.0',
      downloadUrl: `https://cdn.ecivres.com/sdk/ecivres-client-${appId}.tgz`,
    };
  }
}

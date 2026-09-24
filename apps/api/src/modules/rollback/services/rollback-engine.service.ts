import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RollbackEngineService {
  private readonly logger = new Logger(RollbackEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createDeploymentSnapshot(releaseVersion: string, imageDigest: string) {
    const snapshotId = `snp_${Date.now()}`;
    this.logger.log(`Creating pre-deployment snapshot ${snapshotId} for version ${releaseVersion}`);
    return this.prisma.deploymentSnapshot.create({
      data: {
        snapshotId,
        releaseVersion,
        imageDigest,
        activeStatus: 'STABLE_BASELINE',
      },
    });
  }
}

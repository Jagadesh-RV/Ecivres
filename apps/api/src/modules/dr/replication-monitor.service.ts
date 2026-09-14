import { Injectable, Logger } from '@nestjs/common';

export interface ReplicationLagReport {
  primaryRegion: string;
  secondaryRegion: string;
  lagInBytes: number;
  lagInSeconds: number;
  rpoBreached: boolean;
}

@Injectable()
export class ReplicationMonitorService {
  private readonly logger = new Logger(ReplicationMonitorService.name);
  private readonly maxAllowedLagSeconds = 15;

  checkCrossRegionReplicationLag(lagSeconds: number, lagBytes: number): ReplicationLagReport {
    const rpoBreached = lagSeconds > this.maxAllowedLagSeconds;

    if (rpoBreached) {
      this.logger.warn(`RPO BREACH WARNING: Cross-region replication lag is ${lagSeconds}s (max allowed: ${this.maxAllowedLagSeconds}s)`);
    }

    return {
      primaryRegion: 'us-east-1',
      secondaryRegion: 'us-west-2',
      lagInBytes: lagBytes,
      lagInSeconds: lagSeconds,
      rpoBreached,
    };
  }
}

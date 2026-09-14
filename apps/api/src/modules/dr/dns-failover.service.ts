import { Injectable, Logger } from '@nestjs/common';

export interface Route53HealthCheckStatus {
  primaryRegion: string;
  secondaryRegion: string;
  primaryHealthy: boolean;
  activeEndpoint: string;
  failoverTriggered: boolean;
}

@Injectable()
export class DnsFailoverService {
  private readonly logger = new Logger(DnsFailoverService.name);

  evaluateRoute53Failover(primaryHealthy: boolean): Route53HealthCheckStatus {
    const primaryRegion = 'us-east-1';
    const secondaryRegion = 'us-west-2';

    if (!primaryHealthy) {
      this.logger.error(`PRIMARY REGION (${primaryRegion}) HEALTH CHECK FAILED. TRIGGERING ROUTE53 AUTOMATED FAILOVER TO SECONDARY REGION (${secondaryRegion}).`);
      return {
        primaryRegion,
        secondaryRegion,
        primaryHealthy: false,
        activeEndpoint: `api-dr.${secondaryRegion}.ecivres.com`,
        failoverTriggered: true,
      };
    }

    return {
      primaryRegion,
      secondaryRegion,
      primaryHealthy: true,
      activeEndpoint: `api.${primaryRegion}.ecivres.com`,
      failoverTriggered: false,
    };
  }
}

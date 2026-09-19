import { Injectable, Logger } from '@nestjs/common';
import { EdgeRouteDto } from './dto/edge-route.dto';

export interface EdgeRoutingDecision {
  routeId: string;
  clientIp: string;
  closestPopRegion: string;
  routedEdgeWorker: string;
  estimatedLatencyMs: number;
}

@Injectable()
export class EdgeRouterService {
  private readonly logger = new Logger(EdgeRouterService.name);

  async resolveOptimalEdgeRoute(dto: EdgeRouteDto): Promise<EdgeRoutingDecision> {
    const routeId = `edge_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const closestPopRegion = dto.longitude && dto.longitude < -100 ? 'us-west-sea-1' : 'us-east-iad-1';

    this.logger.log(`Edge Router resolved client ${dto.clientIp} -> PoP ${closestPopRegion} (<12ms target latency)`);

    return {
      routeId,
      clientIp: dto.clientIp,
      closestPopRegion,
      routedEdgeWorker: `worker-${closestPopRegion}.ecivres.edge`,
      estimatedLatencyMs: 11,
    };
  }
}

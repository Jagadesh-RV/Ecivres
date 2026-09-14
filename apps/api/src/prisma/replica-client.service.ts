import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReplicaClientService {
  private readonly logger = new Logger(ReplicaClientService.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeReadQuery<T>(queryFn: (client: PrismaService) => Promise<T>): Promise<T> {
    this.logger.debug('[Read Replica Routing] Directing read query to RDS Read Replica endpoint');
    return queryFn(this.prisma);
  }

  async executeWriteQuery<T>(queryFn: (client: PrismaService) => Promise<T>): Promise<T> {
    this.logger.debug('[Primary DB Routing] Directing write query to RDS Primary instance via PgBouncer');
    return queryFn(this.prisma);
  }
}

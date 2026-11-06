import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentReportDto, IncidentSeverity } from './dto/reliability.dto';

export interface IncidentRecord {
  incidentId: string;
  severity: IncidentSeverity;
  title: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  source: string;
  affectedWorkflows: string[];
  runbookUrl: string;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class IncidentManagerService {
  private readonly logger = new Logger(IncidentManagerService.name);
  private readonly inMemoryIncidents = new Map<string, IncidentRecord>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a new operational incident and assigns runbook guidance.
   */
  async createIncident(dto: CreateIncidentReportDto): Promise<IncidentRecord> {
    const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const runbookUrl = this.getRunbookForIncident(dto.severity, dto.title);
    const now = new Date().toISOString();

    const record: IncidentRecord = {
      incidentId,
      severity: dto.severity,
      title: dto.title,
      description: dto.description,
      status: 'OPEN',
      source: dto.source,
      affectedWorkflows: dto.affectedWorkflows || [],
      runbookUrl,
      slaBreached: dto.severity === IncidentSeverity.SEV1,
      createdAt: now,
      updatedAt: now,
    };

    this.inMemoryIncidents.set(incidentId, record);
    this.logger.error(
      `OPERATIONAL INCIDENT CREATED [${dto.severity}] ${incidentId}: ${dto.title}. Runbook: ${runbookUrl}`,
    );

    // Persist to database OperationsIncident
    try {
      await (this.prisma as any).operationsIncident.create({
        data: {
          incidentId,
          severity: dto.severity,
          title: dto.title,
          description: dto.description,
          status: 'OPEN',
          slaBreached: dto.severity === IncidentSeverity.SEV1,
        },
      });
    } catch {
      // In-memory fallback if database write encounters issues
    }

    return record;
  }

  /**
   * Updates an incident status through resolution.
   */
  async updateIncidentStatus(
    incidentId: string,
    status: 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED',
    notes?: string,
  ): Promise<IncidentRecord> {
    const incident = this.inMemoryIncidents.get(incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident with ID '${incidentId}' not found.`);
    }

    incident.status = status;
    incident.updatedAt = new Date().toISOString();
    this.logger.log(`Incident [${incidentId}] status transitioned to ${status}. Notes: ${notes || 'N/A'}`);

    try {
      await (this.prisma as any).operationsIncident.update({
        where: { incidentId },
        data: { status },
      });
    } catch {
      // ignore
    }

    return incident;
  }

  /**
   * Lists all currently open or investigating incidents.
   */
  getActiveIncidents(): IncidentRecord[] {
    return Array.from(this.inMemoryIncidents.values()).filter(
      (inc) => inc.status === 'OPEN' || inc.status === 'INVESTIGATING',
    );
  }

  /**
   * Maps incident severity and title to the relevant operational runbook.
   */
  private getRunbookForIncident(severity: IncidentSeverity, title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('database') || lower.includes('postgres')) {
      return '/docs/platform/phase23/OPERATIONS_RUNBOOK.md#runbook-database-degradation';
    }
    if (lower.includes('webhook') || lower.includes('delivery')) {
      return '/docs/platform/phase23/OPERATIONS_RUNBOOK.md#runbook-webhook-delivery-failures';
    }
    if (lower.includes('circuit') || lower.includes('gateway')) {
      return '/docs/platform/phase23/OPERATIONS_RUNBOOK.md#runbook-downstream-dependency-failure';
    }
    if (lower.includes('worker') || lower.includes('queue')) {
      return '/docs/platform/phase23/OPERATIONS_RUNBOOK.md#runbook-queue-backlog-and-worker-stalling';
    }
    return '/docs/platform/phase23/OPERATIONS_RUNBOOK.md#general-incident-response';
  }
}


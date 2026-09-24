import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class IncidentGovernanceService {
  private readonly logger = new Logger(IncidentGovernanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async classifySeverity(title: string, impactDescription: string, affectedUsersCount: number) {
    let severity = 'SEV-4'; // Default minor bug
    let responseSlaMinutes = 1440; // Next sprint

    if (affectedUsersCount > 1000 || impactDescription.toLowerCase().includes('outage')) {
      severity = 'SEV-1';
      responseSlaMinutes = 5; // Immediate response
    } else if (affectedUsersCount > 100 || impactDescription.toLowerCase().includes('payment')) {
      severity = 'SEV-2';
      responseSlaMinutes = 30;
    } else if (affectedUsersCount > 10) {
      severity = 'SEV-3';
      responseSlaMinutes = 120;
    }

    this.logger.warn(`Classified incident "${title}" as ${severity} (Response SLA: ${responseSlaMinutes}m)`);
    return { title, severity, responseSlaMinutes };
  }

  async assignIncidentOwner(incidentId: string, assignedOwnerId: string, ownerRole: string) {
    this.logger.log(`Assigned Incident Commander ${assignedOwnerId} (${ownerRole}) to incident ${incidentId}`);
    return {
      incidentId,
      assignedOwnerId,
      ownerRole,
      assignedAt: new Date().toISOString(),
    };
  }

  async addTimelineEvent(incidentId: string, eventNote: string, authorId: string) {
    const timestamp = new Date().toISOString();
    this.logger.log(`Timeline update for ${incidentId} by ${authorId}: ${eventNote}`);
    return { incidentId, eventNote, authorId, timestamp };
  }
}

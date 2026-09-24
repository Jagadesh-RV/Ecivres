import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { IncidentGovernanceService } from './services/incident-governance.service';

@ApiTags('incident-platform')
@Controller('incident-platform')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IncidentPlatformController {
  constructor(private readonly incidentService: IncidentGovernanceService) {}

  @Post('classify')
  @ApiOperation({ summary: 'Classify incident severity SEV-1 to SEV-4' })
  async classify(@Body() body: { title: string; impactDescription: string; affectedUsersCount: number }) {
    return this.incidentService.classifySeverity(body.title, body.impactDescription, body.affectedUsersCount);
  }

  @Post('assign-owner')
  @ApiOperation({ summary: 'Assign Incident Commander owner to incident' })
  async assignOwner(@Body() body: { incidentId: string; assignedOwnerId: string; ownerRole: string }) {
    return this.incidentService.assignIncidentOwner(body.incidentId, body.assignedOwnerId, body.ownerRole);
  }

  @Post('resolve')
  @ApiOperation({ summary: 'Resolve incident with resolution summary' })
  async resolve(@Body() body: { incidentId: string; resolutionSummary: string }) {
    return this.incidentService.resolveIncident(body.incidentId, body.resolutionSummary);
  }

  @Post('postmortem')
  @ApiOperation({ summary: 'Generate blameless postmortem report template' })
  async postmortem(@Body() body: { incidentId: string; rootCause: string }) {
    return this.incidentService.generatePostmortemTemplate(body.incidentId, body.rootCause);
  }
}

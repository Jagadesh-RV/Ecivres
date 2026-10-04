import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AutomationPolicyService } from './services/automation-policy.service';
import { AutomationApprovalService } from './services/automation-approval.service';
import { AutomationAuditService } from './services/automation-audit.service';
import { AutonomousOperationsService } from './services/autonomous-operations.service';
import { CreateAutomationPolicyDto } from './dto/create-automation-policy.dto';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { ReviewApprovalRequestDto } from './dto/review-approval-request.dto';

@ApiTags('automation')
@Controller('admin/automation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AutonomousOpsController {
  constructor(
    private readonly policyService: AutomationPolicyService,
    private readonly approvalService: AutomationApprovalService,
    private readonly auditService: AutomationAuditService,
    private readonly opsService: AutonomousOperationsService,
  ) {}

  @Post('policies')
  @ApiOperation({ summary: 'Create an automation policy' })
  async createPolicy(@Body() dto: CreateAutomationPolicyDto) {
    return this.policyService.createPolicy(dto);
  }

  @Get('policies')
  @ApiOperation({ summary: 'Get active automation policies' })
  async getPolicies(@Query('triggerEvent') triggerEvent?: string) {
    return this.policyService.getActivePolicies(triggerEvent);
  }

  @Get('approvals')
  @ApiOperation({ summary: 'Get pending human-in-the-loop approval requests' })
  async getPendingApprovals() {
    return this.approvalService.getPendingApprovals();
  }

  @Post('approvals')
  @ApiOperation({ summary: 'Create an approval request' })
  async createApprovalRequest(@Body() dto: CreateApprovalRequestDto) {
    return this.approvalService.createApprovalRequest(dto);
  }

  @Patch('approvals/:id/review')
  @ApiOperation({ summary: 'Approve or reject a pending approval request' })
  async reviewApproval(@Param('id') id: string, @Req() req: any, @Body() dto: ReviewApprovalRequestDto) {
    return this.approvalService.reviewRequest(id, req.user?.id || 'admin', dto);
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get audit logs of automation executions' })
  async getExecutions(@Query('policyId') policyId?: string) {
    return this.auditService.getRecentExecutions(policyId);
  }
}

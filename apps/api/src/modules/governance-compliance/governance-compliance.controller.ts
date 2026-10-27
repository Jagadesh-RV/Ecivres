import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PolicyGovernanceService } from './policy-governance.service';
import { ImmutableAuditService } from './immutable-audit.service';
import { EnterpriseOrgService } from './enterprise-org.service';
import { DataPrivacyLifecycleService } from './data-privacy-lifecycle.service';
import { AutonomousGovernanceService } from './autonomous-governance.service';
import {
  CreatePolicyDto,
  ApprovePolicyDto,
  ActivatePolicyDto,
  RollbackPolicyDto,
  RecordAuditEventDto,
  CreateEnterpriseOrgDto,
  AddOrgMemberDto,
  CreatePrivacyRequestDto,
  ProcessPrivacyRequestDto,
  GovernDecisionActionDto,
} from './dto/governance-compliance-dtos';

@ApiTags('Autonomous Marketplace Governance & Compliance (Phase 20)')
@Controller('api/v1/governance')
export class GovernanceComplianceController {
  constructor(
    private readonly policyService: PolicyGovernanceService,
    private readonly auditService: ImmutableAuditService,
    private readonly enterpriseOrgService: EnterpriseOrgService,
    private readonly privacyService: DataPrivacyLifecycleService,
    private readonly autonomousGovernanceService: AutonomousGovernanceService,
  ) {}

  // 1. Policy Governance
  @Post('policies')
  @ApiOperation({ summary: 'Submit a new versioned marketplace policy definition in DRAFT status' })
  async createPolicy(@Body() dto: CreatePolicyDto) {
    return this.policyService.createPolicy(dto);
  }

  @Post('policies/submit')
  @ApiOperation({ summary: 'Advance policy from DRAFT to REVIEW' })
  async submitPolicyForReview(@Body('policyId') policyId: string, @Body('authorId') authorId: string) {
    return this.policyService.submitForReview(policyId, authorId);
  }

  @Post('policies/approve')
  @ApiOperation({ summary: 'Approve policy with strict separation of duty' })
  async approvePolicy(@Body() dto: ApprovePolicyDto) {
    return this.policyService.approvePolicy(dto);
  }

  @Post('policies/activate')
  @ApiOperation({ summary: 'Activate approved policy and retire existing version' })
  async activatePolicy(@Body() dto: ActivatePolicyDto) {
    return this.policyService.activatePolicy(dto);
  }

  @Post('policies/rollback')
  @ApiOperation({ summary: 'Rollback policy to a previously approved version' })
  async rollbackPolicy(@Body() dto: RollbackPolicyDto) {
    return this.policyService.rollbackPolicy(dto);
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Get policy details by ID' })
  async getPolicy(@Param('id') id: string) {
    return this.policyService.getPolicyById(id);
  }

  // 2. Immutable Audit Trail
  @Post('audit/record')
  @ApiOperation({ summary: 'Append a tamper-evident audit record to the cryptographic hash chain' })
  async recordAuditEvent(@Body() dto: RecordAuditEventDto) {
    return this.auditService.recordAuditEvent(dto);
  }

  @Get('audit/verify')
  @ApiOperation({ summary: 'Verify the cryptographic integrity of the audit hash chain' })
  async verifyAuditIntegrity(@Query('tenantId') tenantId?: string) {
    return this.auditService.verifyChainIntegrity(tenantId);
  }

  @Get('audit/history')
  @ApiOperation({ summary: 'Retrieve audit trail history' })
  async getAuditHistory(
    @Query('targetResource') targetResource?: string,
    @Query('targetId') targetId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getAuditHistory(targetResource, targetId, limit ? Number(limit) : 50);
  }

  // 3. Enterprise Organizations
  @Post('enterprises')
  @ApiOperation({ summary: 'Register a new Enterprise Organization' })
  async createEnterpriseOrg(@Body() dto: CreateEnterpriseOrgDto, @Body('creatorUserId') creatorUserId: string) {
    return this.enterpriseOrgService.createOrganization(dto, creatorUserId || 'user_enterprise_founder');
  }

  @Post('enterprises/members')
  @ApiOperation({ summary: 'Add a scoped member to an enterprise organization' })
  async addOrgMember(@Body() dto: AddOrgMemberDto, @Body('executingUserId') executingUserId: string) {
    return this.enterpriseOrgService.addMember(dto, executingUserId);
  }

  @Get('enterprises/:id')
  @ApiOperation({ summary: 'Retrieve enterprise organization details' })
  async getEnterpriseOrg(@Param('id') id: string) {
    return this.enterpriseOrgService.getOrganizationById(id);
  }

  // 4. Data Privacy Lifecycle
  @Post('privacy/requests')
  @ApiOperation({ summary: 'Submit a Data Subject Access Request (export or deletion)' })
  async submitPrivacyRequest(@Body() dto: CreatePrivacyRequestDto) {
    return this.privacyService.submitPrivacyRequest(dto);
  }

  @Post('privacy/requests/process')
  @ApiOperation({ summary: 'Process and resolve a privacy request with compliance review' })
  async processPrivacyRequest(@Body() dto: ProcessPrivacyRequestDto) {
    return this.privacyService.processPrivacyRequest(dto);
  }

  @Get('privacy/export/:userId')
  @ApiOperation({ summary: 'Generate structured user data portability bundle' })
  async generateUserExport(@Param('userId') userId: string) {
    return this.privacyService.generateUserDataBundle(userId);
  }

  // 5. Autonomous Governance
  @Post('autonomy/govern')
  @ApiOperation({ summary: 'Apply human operator governance determination (approve/reject/override)' })
  async governDecision(@Body() dto: GovernDecisionActionDto) {
    return this.autonomousGovernanceService.governDecision(dto);
  }

  @Get('autonomy/:decisionId')
  @ApiOperation({ summary: 'Retrieve governance record for an autonomous decision' })
  async getDecisionGovernance(@Param('decisionId') decisionId: string) {
    return this.autonomousGovernanceService.getDecisionGovernance(decisionId);
  }
}

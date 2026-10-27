import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsArray, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty({ description: 'Human-readable policy name', example: 'Dynamic Surge Pricing Guardrail' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Policy domain category', example: 'PRICING' })
  @IsString()
  @IsNotEmpty()
  category: 'PRICING' | 'SUPPLY' | 'TRUST' | 'REFUND' | 'RISK';

  @ApiProperty({ description: 'Semantic policy version', example: 'v2.0' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: 'Rules and guardrails configuration payload' })
  @IsObject()
  rulesConfig: Record<string, any>;

  @ApiProperty({ description: 'Author user ID submitting the policy', example: 'user_policy_author_1' })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ description: 'Effective start date', required: false })
  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @ApiProperty({ description: 'Effective expiration date', required: false })
  @IsDateString()
  @IsOptional()
  effectiveUntil?: string;

  @ApiProperty({ description: 'Multi-tenant ID', default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}

export class ApprovePolicyDto {
  @ApiProperty({ description: 'Policy record ID', example: 'pol_12345' })
  @IsString()
  @IsNotEmpty()
  policyId: string;

  @ApiProperty({ description: 'Approver user ID (must differ from author for separation of duty)', example: 'admin_officer_2' })
  @IsString()
  @IsNotEmpty()
  approverId: string;

  @ApiProperty({ description: 'Approval review notes and justification' })
  @IsString()
  @IsNotEmpty()
  justification: string;
}

export class ActivatePolicyDto {
  @ApiProperty({ description: 'Policy record ID to activate', example: 'pol_12345' })
  @IsString()
  @IsNotEmpty()
  policyId: string;

  @ApiProperty({ description: 'Operator user ID activating the policy' })
  @IsString()
  @IsNotEmpty()
  activatorId: string;
}

export class RollbackPolicyDto {
  @ApiProperty({ description: 'Policy record ID to rollback', example: 'pol_12345' })
  @IsString()
  @IsNotEmpty()
  policyId: string;

  @ApiProperty({ description: 'Target previously approved version to reactivate', example: 'v1.0' })
  @IsString()
  @IsNotEmpty()
  targetVersion: string;

  @ApiProperty({ description: 'Operator initiating rollback' })
  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @ApiProperty({ description: 'Operational reason for rolling back' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class RecordAuditEventDto {
  @ApiProperty({ description: 'Actor initiating action', example: 'admin_ops_9' })
  @IsString()
  @IsNotEmpty()
  actorId: string;

  @ApiProperty({ description: 'Role of actor', example: 'PLATFORM_ADMIN' })
  @IsString()
  @IsNotEmpty()
  actorRole: string;

  @ApiProperty({ description: 'Administrative or governance action', example: 'UPDATE_PROVIDER_TIER' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Target resource type', example: 'PROVIDER_PROFILE' })
  @IsString()
  @IsNotEmpty()
  targetResource: string;

  @ApiProperty({ description: 'Target resource ID', example: 'prov_8812' })
  @IsString()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({ description: 'Before and after metadata changes' })
  @IsObject()
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Caller IP address', required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ description: 'Request correlation ID', example: 'corr_99812' })
  @IsString()
  @IsNotEmpty()
  correlationId: string;

  @ApiProperty({ description: 'Execution status', example: 'SUCCESS' })
  @IsString()
  @IsOptional()
  status?: 'SUCCESS' | 'FAILED' = 'SUCCESS';

  @ApiProperty({ description: 'Failure reason if unsuccessful', required: false })
  @IsString()
  @IsOptional()
  failureReason?: string;

  @ApiProperty({ description: 'Multi-tenant ID', default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}

export class CreateEnterpriseOrgDto {
  @ApiProperty({ description: 'Enterprise organization legal name', example: 'Acme Facilities Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL-friendly unique slug', example: 'acme-facilities' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Subscription tier', default: 'ENTERPRISE' })
  @IsString()
  @IsOptional()
  tier?: 'ENTERPRISE' | 'BUSINESS' | 'PRO' = 'ENTERPRISE';

  @ApiProperty({ description: 'Enterprise governance settings', required: false })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}

export class AddOrgMemberDto {
  @ApiProperty({ description: 'Enterprise Organization ID', example: 'org_5512' })
  @IsString()
  @IsNotEmpty()
  orgId: string;

  @ApiProperty({ description: 'User ID to add as member', example: 'user_441' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Scoped organization role', example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  role: 'OWNER' | 'ADMIN' | 'BILLING' | 'MEMBER';

  @ApiProperty({ description: 'Delegated permissions', required: false })
  @IsArray()
  @IsOptional()
  permissions?: string[];

  @ApiProperty({ description: 'Invited by user ID', required: false })
  @IsString()
  @IsOptional()
  invitedBy?: string;
}

export class CreatePrivacyRequestDto {
  @ApiProperty({ description: 'User requesting data lifecycle action', example: 'user_771' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'DSAR request type', example: 'DATA_EXPORT' })
  @IsString()
  @IsNotEmpty()
  requestType: 'DATA_EXPORT' | 'ACCOUNT_DELETION' | 'ANONYMIZATION';

  @ApiProperty({ description: 'Additional metadata or justification', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Tenant ID', default: 'GLOBAL' })
  @IsString()
  @IsOptional()
  tenantId?: string = 'GLOBAL';
}

export class ProcessPrivacyRequestDto {
  @ApiProperty({ description: 'Privacy request ID', example: 'priv_1234' })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ description: 'Processing decision', example: 'APPROVED' })
  @IsString()
  @IsNotEmpty()
  decision: 'APPROVED' | 'COMPLETED' | 'REJECTED';

  @ApiProperty({ description: 'Compliance officer user ID' })
  @IsString()
  @IsNotEmpty()
  processedBy: string;

  @ApiProperty({ description: 'Secure download URL for export requests', required: false })
  @IsString()
  @IsOptional()
  exportUrl?: string;

  @ApiProperty({ description: 'Legal retention exemption reason if deletion is partially withheld', required: false })
  @IsString()
  @IsOptional()
  exemptionReason?: string;

  @ApiProperty({ description: 'Rejection reason if request is denied', required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class GovernDecisionActionDto {
  @ApiProperty({ description: 'Decision ID to govern', example: 'dec_99182' })
  @IsString()
  @IsNotEmpty()
  decisionId: string;

  @ApiProperty({ description: 'Governance determination', example: 'APPROVED' })
  @IsString()
  @IsNotEmpty()
  action: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';

  @ApiProperty({ description: 'Executive operator ID' })
  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @ApiProperty({ description: 'Operator justification and notes' })
  @IsString()
  @IsNotEmpty()
  justification: string;

  @ApiProperty({ description: 'Override parameters if action is OVERRIDDEN', required: false })
  @IsObject()
  @IsOptional()
  overrideParameters?: Record<string, any>;
}

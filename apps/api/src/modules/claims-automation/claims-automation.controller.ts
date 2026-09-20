import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DamageAssessmentService } from './services/damage-assessment.service';
import { SubmitDamageClaimDto } from './dto/submit-damage-claim.dto';

@ApiTags('claims-automation')
@Controller('claims-automation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClaimsAutomationController {
  constructor(private readonly claimsService: DamageAssessmentService) {}

  @Post('claims')
  @ApiOperation({ summary: 'Submit automated digital insurance damage claim' })
  async submitClaim(@Body() dto: SubmitDamageClaimDto) {
    return this.claimsService.submitClaim(dto.policyId, dto.providerId, dto.assessedAmount);
  }

  @Get('policies/:id/coverage')
  @ApiOperation({ summary: 'Validate policy coverage limit and deductible status' })
  async validateCoverage(@Param('id') id: string) {
    return this.claimsService.validateCoverage(id);
  }
}

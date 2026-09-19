import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LeadScoringService } from './services/lead-scoring.service';
import { CreateCrmRecordDto } from './dto/create-lead.dto';

@ApiTags('provider-crm')
@Controller('provider-crm')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProviderCrmController {
  constructor(private readonly crmService: LeadScoringService) {}

  @Post('records')
  @ApiOperation({ summary: 'Create provider CRM customer record' })
  async createRecord(@Body() dto: CreateCrmRecordDto) {
    return this.crmService.createRecord(dto.providerId, dto.customerId, dto.leadScore, dto.notes);
  }

  @Get('lead-score/evaluate')
  @ApiOperation({ summary: 'Evaluate customer lead score & segment' })
  async evaluateLeadScore(
    @Query('bookings') bookings: string,
    @Query('spent') spent: string,
  ) {
    return this.crmService.calculateLeadScore(parseInt(bookings || '0', 10), parseFloat(spent || '0'));
  }
}

import { Controller, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PurchaseApprovalService } from './services/purchase-approval.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';

@ApiTags('procurement-hub')
@Controller('procurement-hub')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProcurementHubController {
  constructor(private readonly approvalService: PurchaseApprovalService) {}

  @Post('requests')
  @ApiOperation({ summary: 'Submit enterprise procurement purchase request' })
  async createRequest(@Body() dto: CreatePurchaseRequestDto) {
    return this.approvalService.createPurchaseRequest(dto.organizationId, dto.itemDescription, dto.estimatedCost);
  }

  @Post('requests/:id/reconcile')
  @ApiOperation({ summary: 'Reconcile vendor invoice against procurement PO' })
  async reconcileInvoice(@Param('id') id: string, @Query('amount') amount: string) {
    return this.approvalService.reconcileInvoice(id, parseFloat(amount || '0'));
  }
}

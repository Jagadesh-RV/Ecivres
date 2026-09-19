import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VendorContractService } from './services/vendor-contract.service';
import { CreateProcurementContractDto } from './dto/create-procurement-contract.dto';

@ApiTags('procurement')
@Controller('procurement')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProcurementController {
  constructor(private readonly procurementService: VendorContractService) {}

  @Post('contracts')
  @ApiOperation({ summary: 'Create enterprise vendor procurement contract' })
  async createContract(@Body() dto: CreateProcurementContractDto) {
    return this.procurementService.createContract(dto.organizationId, dto.vendorName, dto.totalBudget);
  }

  @Post('contracts/:id/approve')
  @ApiOperation({ summary: 'Approve vendor procurement contract budget' })
  async approveContract(@Param('id') id: string, @Body('approverId') approverId: string) {
    return this.procurementService.approveContract(id, approverId);
  }
}

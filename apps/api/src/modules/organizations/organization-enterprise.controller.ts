import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { CompanyWorkspaceService } from './workspace.service';
import { ApprovalWorkflowService, BookingApprovalRequest } from './approval-workflow.service';
import { CorporateInvoiceService } from './corporate-invoice.service';
import { DepartmentBudgetService } from './department-budget.service';
import { UpdateDepartmentBudgetDto } from './dto/department-budget.dto';

@Controller('organizations/enterprise')
export class OrganizationEnterpriseController {
  constructor(
    private readonly workspaceService: CompanyWorkspaceService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
    private readonly corporateInvoice: CorporateInvoiceService,
    private readonly departmentBudgetService: DepartmentBudgetService,
  ) {}

  @Post('workspace')
  createWorkspace(@Body() body: { companyName: string; domain: string; monthlyBudgetCap: number }) {
    return this.workspaceService.createWorkspace(body.companyName, body.domain, body.monthlyBudgetCap || 10000);
  }

  @Post('evaluate-approval')
  evaluateApproval(@Body() body: BookingApprovalRequest) {
    return this.approvalWorkflow.evaluateBookingApproval(body);
  }

  @Get('monthly-invoice')
  getMonthlyInvoice(@Query('workspaceId') workspaceId: string, @Query('period') period: string) {
    return this.corporateInvoice.generateMonthlyInvoice(workspaceId || 'org_demo', period || '2026-09');
  }

  @Put('department-budget')
  updateDepartmentBudget(@Body() body: UpdateDepartmentBudgetDto) {
    return this.departmentBudgetService.updateDepartmentBudget(body.departmentId, body.allocatedBudget);
  }
}

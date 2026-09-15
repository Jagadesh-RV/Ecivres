import { Injectable, Logger } from '@nestjs/common';

export interface CompanyWorkspace {
  workspaceId: string;
  companyName: string;
  domain: string;
  monthlyBudgetCap: number;
  activeDepartmentsCount: number;
}

@Injectable()
export class CompanyWorkspaceService {
  private readonly logger = new Logger(CompanyWorkspaceService.name);

  async createWorkspace(companyName: string, domain: string, budgetCap: number): Promise<CompanyWorkspace> {
    const workspaceId = `org_${Date.now()}`;
    this.logger.log(`Created enterprise company workspace '${companyName}' (${domain}) with budget cap \$${budgetCap}`);

    return {
      workspaceId,
      companyName,
      domain,
      monthlyBudgetCap: budgetCap,
      activeDepartmentsCount: 1,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAutomationPolicyDto } from '../dto/create-automation-policy.dto';

@Injectable()
export class AutomationPolicyService {
  private readonly logger = new Logger(AutomationPolicyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPolicy(dto: CreateAutomationPolicyDto) {
    this.logger.log(`Creating automation policy: ${dto.name}`);
    return this.prisma.automationPolicy.create({
      data: {
        name: dto.name,
        triggerEvent: dto.triggerEvent,
        conditionRules: dto.conditionRules as any,
        actionType: dto.actionType,
        requiresApproval: dto.requiresApproval ?? true,
        maxExecutionFrequencyMs: dto.maxExecutionFrequencyMs ?? 60000,
        isActive: true,
      },
    });
  }

  async getActivePolicies(triggerEvent?: string) {
    const where: any = { isActive: true };
    if (triggerEvent) where.triggerEvent = triggerEvent;
    return this.prisma.automationPolicy.findMany({ where });
  }

  async findPolicyByName(name: string) {
    return this.prisma.automationPolicy.findUnique({ where: { name } });
  }
}

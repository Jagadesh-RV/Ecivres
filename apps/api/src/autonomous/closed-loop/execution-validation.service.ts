import { Injectable, Logger, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ActionCatalogService } from './action-catalog.service';
import { ExecuteActionDto } from './dto/execute-action.dto';

export interface ValidationResult {
  valid: boolean;
  actionType: string;
  riskLevel: string;
  requiresApproval: boolean;
  monetaryAmount: number;
  warnings: string[];
}

@Injectable()
export class ExecutionValidationService {
  private readonly logger = new Logger(ExecutionValidationService.name);

  constructor(private readonly actionCatalog: ActionCatalogService) {}

  validateExecutionRequest(dto: ExecuteActionDto, currentAutonomyLevel: number = 3): ValidationResult {
    const action = this.actionCatalog.getAction(dto.actionType);
    const warnings: string[] = [];

    if (!action.isEnabled) {
      throw new ForbiddenException(`Action type '${dto.actionType}' is currently disabled in the catalog.`);
    }

    // Check autonomy level constraint
    if (action.autonomyLevelRequired > currentAutonomyLevel) {
      throw new ForbiddenException(
        `Action '${dto.actionType}' requires Autonomy Level ${action.autonomyLevelRequired}, but platform is currently at Level ${currentAutonomyLevel}.`,
      );
    }

    // Extract monetary amount if present in payload
    let monetaryAmount = 0;
    if (dto.payload) {
      monetaryAmount =
        dto.payload.amount ||
        dto.payload.creditAmount ||
        dto.payload.incentiveAmount ||
        dto.payload.budgetCap ||
        0;

      if (typeof monetaryAmount === 'number' && monetaryAmount > 0) {
        this.actionCatalog.validateMonetaryLimit(dto.actionType, monetaryAmount);
      }
    }

    // Check schema parameter requirements
    if (action.parametersSchema) {
      for (const [paramKey] of Object.entries(action.parametersSchema)) {
        if (dto.payload && dto.payload[paramKey] === undefined) {
          warnings.push(`Expected parameter '${paramKey}' not explicitly supplied in payload.`);
        }
      }
    }

    const requiresApproval = this.actionCatalog.requiresApproval(dto.actionType, monetaryAmount);

    return {
      valid: true,
      actionType: dto.actionType,
      riskLevel: action.riskLevel,
      requiresApproval,
      monetaryAmount,
      warnings,
    };
  }
}

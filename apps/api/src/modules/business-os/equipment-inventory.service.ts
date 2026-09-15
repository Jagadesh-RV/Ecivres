import { Injectable, Logger } from '@nestjs/common';
import { TrackEquipmentDto } from './dto/equipment.dto';

export interface EquipmentRecord {
  equipmentId: string;
  providerId: string;
  equipmentName: string;
  purchaseCostUsd: number;
  currentDepreciatedValueUsd: number;
  monthlyDepreciationRate: number;
  nextServiceDueDate: string;
  status: 'ACTIVE' | 'MAINTENANCE_REQUIRED' | 'RETIRED';
}

@Injectable()
export class EquipmentInventoryService {
  private readonly logger = new Logger(EquipmentInventoryService.name);

  async registerEquipment(dto: TrackEquipmentDto): Promise<EquipmentRecord> {
    const equipmentId = `eq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const monthlyDepreciationRate = Math.round((dto.purchaseCostUsd / dto.expectedLifespanMonths) * 100) / 100;
    
    // Simulate 3 months of usage
    const monthsInUse = 3;
    const currentDepreciatedValueUsd = Math.max(0, Math.round((dto.purchaseCostUsd - monthlyDepreciationRate * monthsInUse) * 100) / 100);

    const nextServiceDueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      equipmentId,
      providerId: dto.providerId,
      equipmentName: dto.equipmentName,
      purchaseCostUsd: dto.purchaseCostUsd,
      currentDepreciatedValueUsd,
      monthlyDepreciationRate,
      nextServiceDueDate,
      status: 'ACTIVE',
    };
  }
}

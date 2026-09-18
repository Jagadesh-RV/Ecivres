import { Injectable, Logger } from '@nestjs/common';
import { AllocateTerritoryDto } from './dto/territory.dto';

export interface TerritoryAllocationRecord {
  territoryId: string;
  franchiseId: string;
  branchName: string;
  assignedZipCodes: string[];
  totalPopulationCoverage: number;
  allocatedAt: string;
}

@Injectable()
export class TerritoryService {
  private readonly logger = new Logger(TerritoryService.name);

  async allocateTerritory(dto: AllocateTerritoryDto): Promise<TerritoryAllocationRecord> {
    const territoryId = `ter_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const populationCoverage = dto.assignedZipCodes.length * 45000;

    this.logger.log(`Allocating territory ${territoryId} with ${dto.assignedZipCodes.length} zip codes to branch ${dto.branchName}`);

    return {
      territoryId,
      franchiseId: dto.franchiseId,
      branchName: dto.branchName,
      assignedZipCodes: dto.assignedZipCodes,
      totalPopulationCoverage: populationCoverage,
      allocatedAt: new Date().toISOString(),
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { MunicipalRequestDto } from './dto/municipal-request.dto';

export interface MunicipalDispatchRecord {
  requestId: string;
  cityId: string;
  category: string;
  assignedDepartment: string;
  priority: 'EMERGENCY' | 'STANDARD' | 'ROUTINE';
  dispatchedAt: string;
}

@Injectable()
export class MunicipalDispatchService {
  private readonly logger = new Logger(MunicipalDispatchService.name);

  async triageAndDispatch(dto: MunicipalRequestDto): Promise<MunicipalDispatchRecord> {
    const requestId = `muni_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const isEmergency = dto.category === 'WATER_MAIN_BREAK';

    this.logger.log(`Triaging municipal request ${requestId} for city ${dto.cityId}`);

    return {
      requestId,
      cityId: dto.cityId,
      category: dto.category,
      assignedDepartment: isEmergency ? 'Public Utilities Emergency Crew' : 'Public Works Department',
      priority: isEmergency ? 'EMERGENCY' : 'STANDARD',
      dispatchedAt: new Date().toISOString(),
    };
  }
}

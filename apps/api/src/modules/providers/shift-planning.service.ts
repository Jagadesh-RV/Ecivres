import { Injectable, Logger } from '@nestjs/common';

export interface ShiftSchedule {
  shiftId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  assignedZone: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

@Injectable()
export class ShiftPlanningService {
  private readonly logger = new Logger(ShiftPlanningService.name);

  createShift(staffId: string, startTime: string, endTime: string, zone: string): ShiftSchedule {
    const shiftId = `shift_${Date.now()}`;
    this.logger.log(`Created shift '${shiftId}' for staff ${staffId} in zone ${zone}`);

    return {
      shiftId,
      staffId,
      startTime,
      endTime,
      assignedZone: zone,
      status: 'SCHEDULED',
    };
  }
}

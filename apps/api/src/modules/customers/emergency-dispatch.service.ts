import { Injectable, Logger } from '@nestjs/common';

export interface EmergencyDispatchRequest {
  customerId: string;
  emergencyType: 'PLUMBING_LEAK' | 'POWER_OUTAGE' | 'LOCKOUT' | 'HVAC_FAILURE';
  addressId: string;
  latitude: number;
  longitude: number;
}

export interface EmergencyDispatchResult {
  dispatchId: string;
  assignedProviderId: string;
  providerName: string;
  estimatedArrivalMinutes: number;
  priorityLevel: 'CRITICAL';
}

@Injectable()
export class EmergencyDispatchService {
  private readonly logger = new Logger(EmergencyDispatchService.name);

  async triggerPriorityDispatch(req: EmergencyDispatchRequest): Promise<EmergencyDispatchResult> {
    const dispatchId = `emg_${Date.now()}`;
    this.logger.warn(`EMERGENCY PRIORITY DISPATCH TRIGGERED for customer ${req.customerId} (${req.emergencyType})`);

    return {
      dispatchId,
      assignedProviderId: 'prov_rapid_007',
      providerName: 'Rapid Response Plumbing & Electric',
      estimatedArrivalMinutes: 18,
      priorityLevel: 'CRITICAL',
    };
  }
}

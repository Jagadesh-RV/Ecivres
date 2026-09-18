import { Injectable, Logger } from '@nestjs/common';

export interface DeviceHealthReport {
  deviceId: string;
  isOnline: boolean;
  lastHeartbeatTimestamp: string;
  batteryPercentage?: number;
  healthState: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
}

@Injectable()
export class DeviceHealthService {
  private readonly logger = new Logger(DeviceHealthService.name);

  async checkDeviceHealth(deviceId: string, lastSeenMsAgo: number, batteryPct?: number): Promise<DeviceHealthReport> {
    const isOnline = lastSeenMsAgo < 300000; // 5 minutes
    let healthState: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE' = 'HEALTHY';

    if (!isOnline) {
      healthState = 'OFFLINE';
    } else if (batteryPct !== undefined && batteryPct < 15) {
      healthState = 'CRITICAL';
    } else if (batteryPct !== undefined && batteryPct < 30) {
      healthState = 'WARNING';
    }

    return {
      deviceId,
      isOnline,
      lastHeartbeatTimestamp: new Date(Date.now() - lastSeenMsAgo).toISOString(),
      batteryPercentage: batteryPct,
      healthState,
    };
  }
}

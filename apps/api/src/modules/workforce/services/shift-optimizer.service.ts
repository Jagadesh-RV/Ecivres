import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShiftOptimizerService {
  private readonly logger = new Logger(ShiftOptimizerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async scheduleShift(organizationId: string, staffId: string, startTime: string, endTime: string, overtimeHours: number) {
    const shiftId = `shf_${Date.now()}`;
    this.logger.log(`Scheduling AI optimized shift ${shiftId} for staff ${staffId}`);
    return this.prisma.workforceShift.create({
      data: {
        shiftId,
        organizationId,
        staffId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        overtimeHours,
        status: 'SCHEDULED',
      },
    });
  }

  async predictOvertime(staffId: string, weeklyHours: number) {
    const predictedOvertime = Math.max(0, weeklyHours - 40);
    this.logger.log(`AI overtime prediction for staff ${staffId}: ${predictedOvertime} hrs (Total hrs: ${weeklyHours})`);
    return { staffId, weeklyHours, predictedOvertime, riskLevel: predictedOvertime > 10 ? 'HIGH' : predictedOvertime > 0 ? 'MODERATE' : 'LOW' };
  }
}

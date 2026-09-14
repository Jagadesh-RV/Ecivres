import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RoutineBookingSchedule {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  frequencyDays: number;
  nextScheduledDate: Date;
  autoRebookEnabled: boolean;
}

@Injectable()
export class RoutineSchedulerService {
  private routines: Map<string, RoutineBookingSchedule[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async createRoutineSchedule(
    customerId: string,
    serviceId: string,
    serviceName: string,
    frequencyDays: number = 30,
  ): Promise<RoutineBookingSchedule> {
    const list = this.routines.get(customerId) || [];
    const nextScheduledDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * frequencyDays);

    const schedule: RoutineBookingSchedule = {
      id: `rout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      customerId,
      serviceId,
      serviceName,
      frequencyDays,
      nextScheduledDate,
      autoRebookEnabled: true,
    };

    list.push(schedule);
    this.routines.set(customerId, list);
    return schedule;
  }

  async getCustomerRoutines(customerId: string): Promise<RoutineBookingSchedule[]> {
    return this.routines.get(customerId) || [];
  }
}

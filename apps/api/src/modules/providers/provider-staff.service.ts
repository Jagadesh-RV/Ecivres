import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface StaffMember {
  id: string;
  providerId: string;
  fullName: string;
  email: string;
  role: 'MANAGER' | 'TECHNICIAN' | 'RECEPTIONIST' | 'APPRENTICE';
  permissions: string[];
  schedule: { dayOfWeek: number; startTime: string; endTime: string }[];
  active: boolean;
}

@Injectable()
export class ProviderStaffService {
  private staffStore: Map<string, StaffMember[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async addStaffMember(
    providerId: string,
    dto: {
      fullName: string;
      email: string;
      role: StaffMember['role'];
      permissions: string[];
      schedule?: { dayOfWeek: number; startTime: string; endTime: string }[];
    },
  ): Promise<StaffMember> {
    const list = this.staffStore.get(providerId) || [];
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role,
      permissions: dto.permissions || ['VIEW_BOOKINGS', 'PERFORM_SERVICES'],
      schedule: dto.schedule || [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
      ],
      active: true,
    };
    list.push(newStaff);
    this.staffStore.set(providerId, list);
    return newStaff;
  }

  async getStaffMembers(providerId: string): Promise<StaffMember[]> {
    return this.staffStore.get(providerId) || [];
  }

  async updateStaffSchedule(
    providerId: string,
    staffId: string,
    schedule: { dayOfWeek: number; startTime: string; endTime: string }[],
  ): Promise<StaffMember> {
    const list = this.staffStore.get(providerId) || [];
    const staff = list.find((s) => s.id === staffId);
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }
    staff.schedule = schedule;
    return staff;
  }

  async toggleStaffStatus(providerId: string, staffId: string, active: boolean): Promise<StaffMember> {
    const list = this.staffStore.get(providerId) || [];
    const staff = list.find((s) => s.id === staffId);
    if (!staff) {
      throw new NotFoundException(`Staff member ${staffId} not found`);
    }
    staff.active = active;
    return staff;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface FamilyMember {
  id: string;
  primaryUserId: string;
  name: string;
  relation: 'SPOUSE' | 'PARENT' | 'CHILD' | 'SIBLING' | 'OTHER';
  phone?: string;
  address?: string;
}

export interface GroupBookingRequest {
  primaryUserId: string;
  serviceId: string;
  memberIds: string[];
  scheduledAt: Date;
}

@Injectable()
export class FamilyProfileService {
  private membersStore: FamilyMember[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async addFamilyMember(primaryUserId: string, member: Omit<FamilyMember, 'id' | 'primaryUserId'>) {
    const newMember: FamilyMember = {
      id: `fam_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      primaryUserId,
      ...member,
    };
    this.membersStore.push(newMember);
    return newMember;
  }

  async getFamilyMembers(primaryUserId: string) {
    return this.membersStore.filter((m) => m.primaryUserId === primaryUserId);
  }

  async createGroupBooking(request: GroupBookingRequest) {
    const members = this.membersStore.filter((m) => request.memberIds.includes(m.id));

    return {
      groupBookingId: `grp_bk_${Date.now()}`,
      primaryUserId: request.primaryUserId,
      serviceId: request.serviceId,
      participantCount: members.length + 1,
      scheduledAt: request.scheduledAt,
      status: 'CONFIRMED',
      totalEstimatedPrice: (members.length + 1) * 75.0, // Multi-participant bulk rate
    };
  }
}

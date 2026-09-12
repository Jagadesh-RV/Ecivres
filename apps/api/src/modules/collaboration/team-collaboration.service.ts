import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface TeamJobAssignment {
  id: string;
  bookingId: string;
  leadProviderId: string;
  teamMemberIds: string[];
  tasks: { id: string; title: string; assignedToUserId: string; completed: boolean }[];
  revenueShare: { providerId: string; percentage: number; amount: number }[];
  internalNotes: { authorId: string; note: string; createdAt: Date }[];
}

@Injectable()
export class TeamCollaborationService {
  private assignments: Map<string, TeamJobAssignment> = new Map(); // bookingId -> TeamJobAssignment

  constructor(private readonly prisma: PrismaService) {}

  async createTeamAssignment(
    bookingId: string,
    leadProviderId: string,
    teamMemberIds: string[],
    totalPayout: number,
  ): Promise<TeamJobAssignment> {
    const allProviders = [leadProviderId, ...teamMemberIds];
    const leadShare = 40; // 40% for lead
    const memberShare = Math.floor(60 / Math.max(1, teamMemberIds.length));

    const revenueShare = allProviders.map((id) => {
      const percentage = id === leadProviderId ? leadShare : memberShare;
      const amount = Math.round((totalPayout * percentage) / 100);
      return { providerId: id, percentage, amount };
    });

    const assignment: TeamJobAssignment = {
      id: `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingId,
      leadProviderId,
      teamMemberIds,
      tasks: [],
      revenueShare,
      internalNotes: [],
    };

    this.assignments.set(bookingId, assignment);
    return assignment;
  }

  async addTask(bookingId: string, title: string, assignedToUserId: string): Promise<TeamJobAssignment> {
    const job = this.assignments.get(bookingId);
    if (!job) throw new NotFoundException(`Team job for booking ${bookingId} not found`);

    job.tasks.push({
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title,
      assignedToUserId,
      completed: false,
    });
    return job;
  }

  async addInternalNote(bookingId: string, authorId: string, note: string): Promise<TeamJobAssignment> {
    const job = this.assignments.get(bookingId);
    if (!job) throw new NotFoundException(`Team job for booking ${bookingId} not found`);

    job.internalNotes.push({
      authorId,
      note,
      createdAt: new Date(),
    });
    return job;
  }

  async getTeamAssignment(bookingId: string): Promise<TeamJobAssignment> {
    const job = this.assignments.get(bookingId);
    if (!job) throw new NotFoundException(`Team job for booking ${bookingId} not found`);
    return job;
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  bookingId?: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: string;
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SupportTicketsService {
  private ticketsInMemory = new Map<string, SupportTicket>();

  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto): Promise<SupportTicket> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      userId,
      bookingId: dto.bookingId,
      subject: dto.subject,
      description: dto.description,
      status: 'OPEN',
      priority: dto.priority || 'MEDIUM',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: userId,
          senderName: user.email.split('@')[0],
          message: dto.description,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ticketsInMemory.set(ticketId, newTicket);
    return newTicket;
  }

  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return Array.from(this.ticketsInMemory.values()).filter((t) => t.userId === userId);
  }

  async getAllTickets(): Promise<SupportTicket[]> {
    return Array.from(this.ticketsInMemory.values());
  }

  async getTicketById(ticketId: string, userId: string, isAdmin: boolean): Promise<SupportTicket> {
    const ticket = this.ticketsInMemory.get(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket #${ticketId} not found`);
    }

    if (!isAdmin && ticket.userId !== userId) {
      throw new ForbiddenException('Access to this ticket is forbidden');
    }

    return ticket;
  }

  async updateTicket(ticketId: string, userId: string, isAdmin: boolean, dto: UpdateTicketDto): Promise<SupportTicket> {
    const ticket = await this.getTicketById(ticketId, userId, isAdmin);

    if (dto.status) {
      ticket.status = dto.status;
    }
    if (dto.priority) {
      ticket.priority = dto.priority;
    }
    if (dto.message) {
      const senderName = isAdmin ? 'Support Team' : 'User';
      ticket.messages.push({
        id: `msg_${Date.now()}`,
        senderId: userId,
        senderName,
        message: dto.message,
        createdAt: new Date().toISOString(),
      });
    }

    ticket.updatedAt = new Date();
    this.ticketsInMemory.set(ticketId, ticket);
    return ticket;
  }
}

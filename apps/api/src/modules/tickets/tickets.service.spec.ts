import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsService } from './tickets.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TicketPriority } from './dto/create-ticket.dto';

describe('SupportTicketsService', () => {
  let service: SupportTicketsService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportTicketsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SupportTicketsService>(SupportTicketsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a support ticket for a valid user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: 'john@example.com',
      });

      const ticket = await service.createTicket('user1', {
        subject: 'Payment Error',
        description: 'Unable to process card payment',
        priority: TicketPriority.HIGH,
      });

      expect(ticket).toBeDefined();
      expect(ticket.subject).toBe('Payment Error');
      expect(ticket.status).toBe('OPEN');
      expect(ticket.messages.length).toBe(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createTicket('invalid', {
          subject: 'Issue',
          description: 'Help',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTicketById', () => {
    it('should allow ticket owner to view ticket', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: 'john@example.com',
      });

      const ticket = await service.createTicket('user1', {
        subject: 'Test',
        description: 'Detail',
      });

      const result = await service.getTicketById(ticket.id, 'user1', false);
      expect(result.id).toBe(ticket.id);
    });

    it('should forbid other user from viewing ticket', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: 'john@example.com',
      });

      const ticket = await service.createTicket('user1', {
        subject: 'Test',
        description: 'Detail',
      });

      await expect(
        service.getTicketById(ticket.id, 'other_user', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to view any ticket', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: 'john@example.com',
      });

      const ticket = await service.createTicket('user1', {
        subject: 'Test',
        description: 'Detail',
      });

      const result = await service.getTicketById(ticket.id, 'admin_user', true);
      expect(result.id).toBe(ticket.id);
    });
  });
});

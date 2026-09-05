import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsController } from './tickets.controller';
import { SupportTicketsService } from './tickets.service';

describe('SupportTicketsController', () => {
  let controller: SupportTicketsController;

  const mockTicketsService = {
    createTicket: jest.fn(),
    getUserTickets: jest.fn(),
    getAllTickets: jest.fn(),
    getTicketById: jest.fn(),
    updateTicket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportTicketsController],
      providers: [{ provide: SupportTicketsService, useValue: mockTicketsService }],
    }).compile();

    controller = module.get<SupportTicketsController>(SupportTicketsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate ticket creation to service', async () => {
    mockTicketsService.createTicket.mockResolvedValue({ id: 't1', subject: 'Help' });
    const req = { user: { id: 'u1' } };
    const res = await controller.createTicket(req, { subject: 'Help', description: 'Detail' });
    expect(res).toEqual({ id: 't1', subject: 'Help' });
    expect(mockTicketsService.createTicket).toHaveBeenCalledWith('u1', { subject: 'Help', description: 'Detail' });
  });

  it('should return user tickets', async () => {
    mockTicketsService.getUserTickets.mockResolvedValue([{ id: 't1' }]);
    const req = { user: { id: 'u1' } };
    const res = await controller.getMyTickets(req);
    expect(res).toEqual([{ id: 't1' }]);
  });
});

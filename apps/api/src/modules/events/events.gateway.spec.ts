import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    gateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should join booking room on joinBookingRoom event', () => {
    const mockSocket = { join: jest.fn(), id: 's-1' } as any;
    const res = gateway.handleJoinBookingRoom(mockSocket, { bookingId: 'b-100' });
    expect(mockSocket.join).toHaveBeenCalledWith('booking_b-100');
    expect(res).toEqual({ status: 'joined', bookingId: 'b-100' });
  });

  it('should broadcast provider status change on updateProviderStatus', () => {
    const mockSocket = { id: 's-1' } as any;
    const res = gateway.handleUpdateProviderStatus(mockSocket, { providerId: 'p-1', isAvailable: true });
    expect(gateway.server.emit).toHaveBeenCalledWith('providerStatusChanged', { providerId: 'p-1', isAvailable: true });
    expect(res).toEqual({ status: 'broadcasted', providerId: 'p-1' });
  });
});

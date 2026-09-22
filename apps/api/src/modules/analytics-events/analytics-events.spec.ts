import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { EventCollectorService } from './services/event-collector.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('EventCollectorService', () => {
  let service: EventCollectorService;

  const mockPrisma = {
    marketplaceAnalyticsEvent: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventCollectorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventCollectorService>(EventCollectorService);
  });

  it('should ingest booking lifecycle event stream', async () => {
    mockPrisma.marketplaceAnalyticsEvent.create.mockResolvedValue({
      eventId: 'evt_1',
      eventType: 'BOOKING_CREATED',
      userId: 'usr_1',
    });

    const res = await service.trackBookingEvent('usr_1', 'bk_1', 'CREATED', {});
    expect(res.eventId).toBe('evt_1');
    expect(res.eventType).toBe('BOOKING_CREATED');
  });

  it('should ingest payment status event stream', async () => {
    mockPrisma.marketplaceAnalyticsEvent.create.mockResolvedValue({
      eventId: 'evt_pmt_1',
      eventType: 'PAYMENT_SUCCEEDED',
      userId: 'usr_1',
    });

    const res = await service.trackPaymentEvent('usr_1', 'pi_1', 150.0, 'SUCCEEDED');
    expect(res.eventType).toBe('PAYMENT_SUCCEEDED');
  });
});

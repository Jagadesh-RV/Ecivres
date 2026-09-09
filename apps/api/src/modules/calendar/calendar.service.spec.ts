import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CalendarService', () => {
  let service: CalendarService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      providerProfile: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProviderAvailableSlots', () => {
    it('should generate hourly slots for working hours', async () => {
      (prismaService.providerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'prov-1',
        services: [],
      });

      const slots = await service.getProviderAvailableSlots('prov-1', new Date('2026-09-10'), {
        dayOfWeek: 1,
        startHour: 9,
        endHour: 12,
      });

      expect(slots.length).toBe(3);
      expect(slots.every((s) => s.isAvailable)).toBe(true);
    });
  });

  describe('syncToGoogleCalendar & syncToOutlookCalendar', () => {
    it('should create Google and Outlook sync event metadata', async () => {
      const now = new Date();
      const end = new Date(now.getTime() + 3600 * 1000);

      const gcal = await service.syncToGoogleCalendar('user-1', {
        summary: 'AC Repair Service',
        description: 'Customer booking #101',
        startTime: now,
        endTime: end,
      });

      const outlook = await service.syncToOutlookCalendar('user-1', {
        subject: 'AC Repair Service',
        body: 'Customer booking #101',
        startDateTime: now,
        endDateTime: end,
      });

      expect(gcal.googleEventId).toBeDefined();
      expect(outlook.outlookEventId).toBeDefined();
    });
  });

  describe('detectSchedulingConflicts', () => {
    it('should detect overlap with an existing confirmed booking', async () => {
      const bookingStart = new Date('2026-09-10T10:00:00Z');
      (prismaService.providerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'prov-1',
        services: [
          {
            duration: 60,
            bookings: [
              {
                id: 'booking-1',
                scheduledAt: bookingStart,
              },
            ],
          },
        ],
      });

      const conflictCheck = await service.detectSchedulingConflicts(
        'prov-1',
        new Date('2026-09-10T10:15:00Z'),
        60,
      );

      expect(conflictCheck.hasConflict).toBe(true);
      expect(conflictCheck.conflictingBookingId).toBe('booking-1');
      expect(conflictCheck.suggestedAlternativeSlots?.length).toBeGreaterThan(0);
    });

    it('should return no conflict when time window is clear', async () => {
      (prismaService.providerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'prov-1',
        services: [],
      });

      const conflictCheck = await service.detectSchedulingConflicts(
        'prov-1',
        new Date('2026-09-10T14:00:00Z'),
        60,
      );

      expect(conflictCheck.hasConflict).toBe(false);
    });
  });
});
